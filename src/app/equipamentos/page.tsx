"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil } from "lucide-react";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAuth } from "@/hooks/useAuth";
import type { Equipment, Page } from "@/lib/api/types";
import { canManageEquipment } from "@/lib/permissions";
import type { ColumnProps } from "@/props/ColumnProps";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";

const PAGE_SIZE = 10;
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function EquipmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = canManageEquipment(user?.role);
  const [equipmentPage, setEquipmentPage] = useState<Page<Equipment> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const requestKey = `${page}:${debouncedSearch}`;
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    equipmentService
      .list({
        page,
        size: PAGE_SIZE,
        sort: "name,asc",
        search: debouncedSearch.trim() || undefined,
      })
      .then((result) => {
        if (active) {
          setEquipmentPage(result);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            getServiceErrorMessage(
              loadError,
              "Não foi possível carregar os equipamentos.",
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
  }, [debouncedSearch, page, requestKey]);

  const columns = useMemo<ColumnProps<Equipment>[]>(() => [
    { header: "Nome", accessorKey: "name" },
    { header: "Código SAP", render: (equipment) => equipment.sap || "Não informado" },
    { header: "Patrimônio", render: (equipment) => equipment.patrimony || "Não informado" },
    { header: "TAG", render: (equipment) => equipment.tag || "Não informada" },
    {
      header: "Preço unitário",
      render: (equipment) => currencyFormatter.format(equipment.unitPrice),
      align: "left",
    },
    { header: "Quantidade disponível", accessorKey: "availableQuantity", align: "center" },
    {
      header: "Ações",
      align: "right",
      render: (equipment) => (
        <div className="flex justify-end gap-2">
          <Button
            href={`/equipamentos/${equipment.id}`}
            variant="secondary"
            icon={Eye}
            iconOnly
            aria-label={`Visualizar equipamento ${equipment.name}`}
            title="Visualizar equipamento"
          />
          {canManage && (
            <Button
              href={`/equipamentos/${equipment.id}/editar`}
              icon={Pencil}
              iconOnly
              aria-label={`Editar equipamento ${equipment.name}`}
              title="Editar equipamento"
            />
          )}
        </div>
      ),
    },
  ], [canManage]);

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Equipamentos"
          description="Gerencie todos os equipamentos cadastrados."
          actions={canManage ? <Button href="/equipamentos/novo">Novo equipamento</Button> : undefined}
        />
        {loading ? (
          <PageFeedback message="Carregando equipamentos..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <>
            <DataTable
              data={equipmentPage?.content ?? []}
              columns={columns}
              searchKeys={["name", "sap", "patrimony", "tag"]}
              searchValue={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(0);
              }}
              searchPlaceholder="Pesquisar por nome, SAP, patrimônio ou TAG..."
              emptyMessage="Nenhum equipamento encontrado."
              onRowClick={(equipment) => router.push(`/equipamentos/${equipment.id}`)}
              getRowAriaLabel={(equipment) => `Visualizar equipamento ${equipment.name}`}
            />
            <Pagination
              page={equipmentPage?.number ?? page}
              totalPages={equipmentPage?.totalPages ?? 0}
              totalElements={equipmentPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}
