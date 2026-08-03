"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Equipment } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function EquipmentsPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEquipments() {
      try {
        const page = await equipmentService.list();
        setEquipments(page.content);
      } catch (loadError) {
        setError(getServiceErrorMessage(loadError, "Não foi possível carregar os equipamentos."));
      } finally {
        setLoading(false);
      }
    }

    void loadEquipments();
  }, []);

  const columns = useMemo<ColumnProps<Equipment>[]>(
    () => [
      { header: "Nome", accessorKey: "name" },
      { header: "Código SAP", render: (equipment) => equipment.sap || "Não informado" },
      { header: "Preço unitário", render: (equipment) => currencyFormatter.format(equipment.unitPrice), align: "right" },
      { header: "Quantidade disponível", accessorKey: "availableQuantity", align: "center" },
      {
        header: "Ações",
        align: "right",
        render: (equipment) => <Link href={`/equipamentos/${equipment.id}`}><Button variant="secondary">Ver detalhes</Button></Link>,
      },
    ],
    [],
  );

  return (
    <LayoutDesktop>
      <div className="space-y-6">
        <PageHeader
          title="Equipamentos"
          description="Gerencie todos os equipamentos cadastrados."
          actions={<Link href="/equipamentos/novo"><Button>Novo equipamento</Button></Link>}
        />
        {loading ? (
          <PageFeedback message="Carregando equipamentos..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <DataTable data={equipments} columns={columns} searchKeys={["name", "sap"]} searchPlaceholder="Pesquisar por nome ou código SAP..." emptyMessage="Nenhum equipamento encontrado." />
        )}
      </div>
    </LayoutDesktop>
  );
}
