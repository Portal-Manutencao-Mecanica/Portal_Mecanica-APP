"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/atoms/Button";
import EquipmentForm from "@/components/organisms/EquipmentForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { CreateEquipment, Equipment } from "@/lib/api/types";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEquipmentPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  async function updateEquipment(payload: CreateEquipment) {
    try {
      await equipmentService.update(id, payload);
      router.push(`/equipamentos/${id}`);
      router.refresh();
    } catch (updateError) {
      throw new Error(
        getServiceErrorMessage(
          updateError,
          "Não foi possível atualizar o equipamento.",
        ),
      );
    }
  }

  return (
    <LayoutDesktop breadcrumbLabels={equipment ? { 1: equipment.name } : undefined}>
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar equipamento</h1>
          <p className="mt-2 text-gray-500">Atualize as informações do equipamento.</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Carregando equipamento...</p>
        ) : equipment ? (
          <EquipmentForm
            initialValues={{
              name: equipment.name,
              sap: equipment.sap ?? undefined,
              patrimony: equipment.patrimony ?? undefined,
              tag: equipment.tag ?? undefined,
              unitPrice: equipment.unitPrice,
              availableQuantity: equipment.availableQuantity,
            }}
            submitLabel="Salvar alterações"
            successMessage="Equipamento atualizado com sucesso."
            onSubmit={updateEquipment}
          />
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-red-700">{error || "Equipamento não encontrado."}</p>
            <Link href="/equipamentos"><Button variant="secondary">Voltar</Button></Link>
          </div>
        )}
      </div>
    </LayoutDesktop>
  );
}
