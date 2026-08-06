"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil } from "lucide-react";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type {
  MaintenanceRequestApi,
  MaintenanceRequestPriority,
  Page,
} from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";
import { getStatusPresentation } from "@/lib/status";

const PAGE_SIZE = 10;

export default function OccurrencesPage() {
  const { user } = useAuth();
  const [requestPage, setRequestPage] = useState<Page<MaintenanceRequestApi> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState<"" | MaintenanceRequestPriority>("");
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const requestKey = `${page}:${debouncedSearch}:${status}:${priority}`;
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    maintenanceRequestService
      .list({
        page,
        size: PAGE_SIZE,
        sort: "createdAt,desc",
        search: debouncedSearch.trim() || undefined,
        status: status || undefined,
        priority: priority || undefined,
      })
      .then((result) => {
        if (active) {
          setRequestPage(result);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            getServiceErrorMessage(loadError, "Não foi possível carregar as ocorrências."),
          );
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch, page, priority, requestKey, status]);

  const columns = useMemo<ColumnProps<MaintenanceRequestApi>[]>(() => [
    { header: "Máquina", accessorKey: "machineName" },
    { header: "Local", accessorKey: "placeName" },
    { header: "Professor", accessorKey: "notifiedTeacherName" },
    { header: "Prioridade", accessorKey: "priority" },
    {
      header: "Situação",
      render: (item) => {
        const status = getStatusPresentation(item.status);
        return <LabelWithCircle status={status.color} text={status.label} />;
      },
    },
    {
      header: "Ações",
      align: "right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <Button
            href={`/ocorrencias/${item.id}`}
            variant="secondary"
            icon={Eye}
            iconOnly
            aria-label={`Visualizar ocorrência da máquina ${item.machineName}`}
            title="Visualizar ocorrência"
          />
          {user?.role === "ADMIN" && (
            <Button
              href={`/ocorrencias/${item.id}/editar`}
              icon={Pencil}
              iconOnly
              aria-label={`Editar ocorrência da máquina ${item.machineName}`}
              title="Editar ocorrência"
            />
          )}
        </div>
      ),
    },
  ], [user?.role]);

  function resetPageAnd<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(0);
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Ocorrências"
          description="Gerencie todas as ocorrências cadastradas."
          actions={<Button href="/ocorrencias/cadastro">Nova ocorrência</Button>}
        />
        {loading ? (
          <PageFeedback message="Carregando ocorrências..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <>
            <DataTable
              data={requestPage?.content ?? []}
              columns={columns}
              searchKeys={["machineName", "placeName", "notifiedTeacherName", "description"]}
              searchValue={search}
              onSearchChange={(value) => resetPageAnd(setSearch, value)}
              searchPlaceholder="Pesquisar ocorrência..."
              emptyMessage="Nenhuma ocorrência encontrada."
              filterElement={
                <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
                  <DropDown
                    id="occurrence-priority-filter"
                    defaultSelection="Todas as prioridades"
                    enumData={{ ALTA: "Alta", MEDIA: "Média", BAIXA: "Baixa" }}
                    value={priority}
                    onSelect={(value) => resetPageAnd(
                      setPriority,
                      value as "" | MaintenanceRequestPriority,
                    )}
                  />
                  <DropDown
                    id="occurrence-status-filter"
                    defaultSelection="Todas as situações"
                    enumData={{
                      PENDENTE_APROVACAO_PROFESSOR: "Pendente do professor",
                      APROVADA_PELO_PROFESSOR: "Aprovada pelo professor",
                      REPROVADA_PELO_PROFESSOR: "Reprovada pelo professor",
                      PENDENTE_APROVACAO_COORDENADOR: "Pendente do coordenador",
                      APROVADA_PELO_COORDENADOR: "Aprovada pelo coordenador",
                      REPROVADA_PELO_COORDENADOR: "Reprovada pelo coordenador",
                      FINALIZADA: "Finalizada",
                      EM_ANALISE: "Em análise",
                    }}
                    value={status}
                    onSelect={(value) => resetPageAnd(setStatus, value)}
                  />
                </div>
              }
            />
            <Pagination
              page={requestPage?.number ?? page}
              totalPages={requestPage?.totalPages ?? 0}
              totalElements={requestPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}
