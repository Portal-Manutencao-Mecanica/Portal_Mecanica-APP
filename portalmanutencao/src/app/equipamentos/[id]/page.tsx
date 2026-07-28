"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Equipment } from "@/lib/api/types";
import { equipmentService } from "@/services/equipmentService";

export default function EquipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    equipmentService.getById(id).then(setEquipment).catch(() => setEquipment(null));
  }, [id]);

  async function handleDelete() {
    await equipmentService.remove(id);
    setOpenDeleteDialog(false);
    router.push("/equipamentos");
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <div className="space-y-8">
        {!equipment ? (
          <p className="ui-surface p-8 text-gray-500">Carregando equipamento...</p>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold">{equipment.name}</h1>
                <p className="text-gray-500">Informações do equipamento.</p>
              </div>
              <div className="flex gap-3">
                <Link href={`/equipamentos/${id}/editar`}><Button>Editar</Button></Link>
                <Button variant="danger" onClick={() => setOpenDeleteDialog(true)}>Deletar</Button>
              </div>
            </div>

            <div className="ui-surface grid gap-6 p-8 md:grid-cols-2">
              <Detail label="Nome" value={equipment.name} />
              <Detail label="Código SAP" value={equipment.sap ?? "-"} />
              <Detail
                label="Valor unitário"
                value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(equipment.unitPrice)}
              />
              <Detail label="Quantidade disponível" value={String(equipment.availableQuantity)} />
            </div>
          </>
        )}

        <ConfirmDialog
          open={openDeleteDialog}
          title="Excluir Equipamento"
          description="Tem certeza que deseja excluir este equipamento? Esta ação não poderá ser desfeita."
          onCancel={() => setOpenDeleteDialog(false)}
          onConfirm={handleDelete}
        />
      </div>
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-semibold">{value}</p></div>;
}
