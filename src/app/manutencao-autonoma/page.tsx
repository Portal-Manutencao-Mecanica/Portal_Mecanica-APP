"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { AutonomousMaintenanceStatusBadge } from "@/components/atoms/AutonomousMaintenanceStatusBadge";
import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type {
  AutonomousMaintenance,
  AutonomousMaintenanceStatus,
  Page,
} from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { autonomousMaintenanceService } from "@/services/autonomousMaintenanceService";
import { getServiceErrorMessage } from "@/services/httpService";

type StatusFilter = AutonomousMaintenanceStatus | "TODAS";
const PAGE_SIZE = 10;
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function AutonomousMaintenancePage() {
  const { user } = useAuth();
  const [maintenancePage, setMaintenancePage] = useState<Page<AutonomousMaintenance> | null>(null);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODAS");
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const requestKey = `${page}:${statusFilter}`;
  const isLoading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    autonomousMaintenanceService
      .list({
        page,
        size: PAGE_SIZE,
        sort: "scheduledFor,asc",
        status: statusFilter === "TODAS" ? undefined : statusFilter,
      })
      .then((result) => {
        if (active) setMaintenancePage(result);
      })
      .catch((error) => {
        if (active) {
          toast.error(
            getServiceErrorMessage(
              error,
              "Não foi possível carregar as manutenções autônomas.",
            ),
          );
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [page, requestKey, statusFilter]);

  const columns = useMemo<ColumnProps<AutonomousMaintenance>[]>(() => [
    { header: "Máquina", accessorKey: "inspectedMachineName" },
    {
      header: "Agendamento",
      render: (maintenance) =>
        dateFormatter.format(new Date(maintenance.scheduledFor)),
    },
    {
      header: "Alunos",
      render: (maintenance) =>
        maintenance.students.map((student) => student.name).join(", "),
    },
    {
      header: "Condição",
      render: (maintenance) =>
        maintenance.equipmentCondition === "CONFORME" ? "Conforme" : "Não conforme",
    },
    {
      header: "Situação",
      render: (maintenance) => (
        <AutonomousMaintenanceStatusBadge status={maintenance.status} />
      ),
    },
    {
      header: "Ações",
      align: "right",
      render: (maintenance) => (
        <div className="flex justify-end gap-2">
          <Button
            href={`/manutencao-autonoma/${maintenance.id}`}
            variant="secondary"
            icon={Eye}
            iconOnly
            aria-label={
              user?.role === "COORDENADOR"
              && maintenance.status === "PENDENTE_APROVACAO_COORDENADOR"
                ? "Analisar manutenção autônoma"
                : "Visualizar manutenção autônoma"
            }
            title="Visualizar manutenção autônoma"
          />
          {(user?.role === "PROFESSOR" || user?.role === "ADMIN") && (
            <Button
              href={`/manutencao-autonoma/${maintenance.id}/editar`}
              icon={Pencil}
              iconOnly
              aria-label={`Editar manutenção da máquina ${maintenance.inspectedMachineName}`}
              title="Editar manutenção autônoma"
            />
          )}
        </div>
      ),
    },
  ], [user?.role]);

  const description =
    user?.role === "COORDENADOR"
      ? "Analise e decida as solicitações enviadas pelos professores."
      : user?.role === "ALUNO"
        ? "Consulte as atividades aprovadas atribuídas a você."
        : "Planeje e acompanhe as atividades atribuídas aos alunos.";

  return (
    <LayoutDesktop>
      <section className="space-y-6 pb-8">
        <PageHeader
          title="Manutenção autônoma"
          description={description}
          actions={user?.role === "PROFESSOR"
            ? <Button href="/manutencao-autonoma/nova" icon={Plus}>Nova manutenção</Button>
            : undefined}
        />

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Carregando manutenções autônomas...
          </div>
        ) : (
          <>
            <DataTable
              data={maintenancePage?.content ?? []}
              columns={columns}
              searchKeys={["inspectedMachineName", "responsibleTeacherName"]}
              searchPlaceholder="Buscar por máquina ou professor"
              emptyMessage="Nenhuma manutenção autônoma encontrada."
              filterElement={
                <div className="w-full sm:w-64">
                  <DropDown
                    id="autonomous-maintenance-status-filter"
                    defaultSelection="Todas as situações"
                    enumData={{
                      PENDENTE_APROVACAO_COORDENADOR: "Pendentes",
                      APROVADA_PELO_COORDENADOR: "Aprovadas",
                      REPROVADA_PELO_COORDENADOR: "Reprovadas",
                    }}
                    value={statusFilter === "TODAS" ? "" : statusFilter}
                    onSelect={(value) => {
                      setStatusFilter((value || "TODAS") as StatusFilter);
                      setPage(0);
                    }}
                  />
                </div>
              }
            />
            <Pagination
              page={maintenancePage?.number ?? page}
              totalPages={maintenancePage?.totalPages ?? 0}
              totalElements={maintenancePage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}
