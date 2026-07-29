"use client";

import { useRouter } from "next/navigation";

import EquipmentForm from "@/components/organisms/EquipmentForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { CreateEquipment } from "@/lib/api/types";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";

export default function NewEquipmentPage() {
  const router = useRouter();

  async function createEquipment(payload: CreateEquipment) {
    try {
      await equipmentService.create(payload);
      router.push("/equipamentos");
      router.refresh();
    } catch (error) {
      throw new Error(
        getServiceErrorMessage(error, "Não foi possível cadastrar o equipamento."),
      );
    }
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Novo equipamento</h1>
          <p className="mt-2 text-gray-500">
            Preencha as informações para cadastrar um novo equipamento.
          </p>
        </div>
        <EquipmentForm submitLabel="Salvar equipamento" successMessage="Equipamento cadastrado com sucesso." onSubmit={createEquipment} />
      </div>
    </LayoutDesktop>
  );
}