"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/atoms/Button";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Equipment } from "@/lib/api/types";
import { useAuth } from "@/hooks/useAuth";
import { canManageEquipment } from "@/lib/permissions";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EquipmentDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const canManage = canManageEquipment(user?.role);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadEquipment() {
      try {
        setEquipment(await equipmentService.getById(id));
      } catch (loadError) {
        setError(
          getServiceErrorMessage(
            loadError,
            "Não foi possível carregar o equipamento.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    loadEquipment();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      await equipmentService.remove(id);
      router.push("/equipamentos");
      router.refresh();
    } catch (deleteError) {
      setError(
        getServiceErrorMessage(
          deleteError,
          "Não foi possível excluir o equipamento.",
        ),
      );
      setOpenDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <LayoutDesktop>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
          Carregando equipamento...
        </div>
      </LayoutDesktop>
    );
  }

  if (!equipment) {
    return (
      <LayoutDesktop>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-red-700">{error || "Equipamento não encontrado."}</p>
          <Link href="/equipamentos"><Button variant="secondary">Voltar</Button></Link>
        </div>
      </LayoutDesktop>
    );
  }

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(equipment.unitPrice);

  return (
    <LayoutDesktop breadcrumbLabels={{ 1: equipment.name }}>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{equipment.name}</h1>
            <p className="text-gray-500">Informações do equipamento.</p>
          </div>
          {canManage && (
            <div className="flex gap-4">
              <Link href={`/equipamentos/${equipment.id}/editar`}><Button>Editar</Button></Link>
              <Button variant="danger" onClick={() => setOpenDeleteDialog(true)}>Deletar</Button>
            </div>
          )}
        </div>

        {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Detail label="Nome" value={equipment.name} />
            <Detail label="Código SAP" value={equipment.sap || "-"} />
            <Detail label="Patrimônio" value={equipment.patrimony || "-"} />
            <Detail label="TAG" value={equipment.tag || "-"} />
            <Detail label="Preço unitário" value={formattedPrice} />
            <Detail label="Quantidade disponível" value={String(equipment.availableQuantity)} />
          </div>
        </div>

        <ConfirmDialog
          open={openDeleteDialog}
          title="Excluir equipamento"
          description="Tem certeza que deseja excluir este equipamento? Esta ação não poderá ser desfeita."
          confirmText={deleting ? "Excluindo..." : "Excluir"}
          onCancel={() => !deleting && setOpenDeleteDialog(false)}
          onConfirm={handleDelete}
        />
      </div>
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-medium text-gray-900">{value}</p>
    </div>
  );
}
