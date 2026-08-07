"use client";

import { useRouter } from "next/navigation";

import SupportMaterialForm from "@/components/organisms/SupportMaterialForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { CreateHelperMaterial } from "@/lib/api/types";
import { supportMaterialService } from "@/services/supportMaterialService";

export default function NewSupportMaterialPage() {
  const router = useRouter();

  async function createMaterial(payload: CreateHelperMaterial) {
    await supportMaterialService.create(payload);
    router.push("/maquinas/material-complementar");
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Novo material de apoio</h1>
          <p className="text-sm text-gray-500 md:text-base">
            Cadastre um material para consulta de alunos, professores e equipes de manutenção.
          </p>
        </div>
        <SupportMaterialForm
          submitLabel="Salvar material"
          successMessage="Material de apoio cadastrado com sucesso."
          onSubmit={createMaterial}
        />
      </section>
    </LayoutDesktop>
  );
}
