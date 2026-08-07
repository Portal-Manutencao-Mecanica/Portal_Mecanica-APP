"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import SupportMaterialForm from "@/components/organisms/SupportMaterialForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { CreateHelperMaterial, HelperMaterial } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { supportMaterialService } from "@/services/supportMaterialService";

export default function EditSupportMaterialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [material, setMaterial] = useState<HelperMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    supportMaterialService.getById(id)
      .then((result) => {
        if (active) setMaterial(result);
      })
      .catch((loadError) => {
        if (active) {
          setError(
            getServiceErrorMessage(loadError, "Não foi possível carregar o material de apoio."),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function updateMaterial(payload: CreateHelperMaterial) {
    await supportMaterialService.update(id, payload);
    router.push(`/maquinas/material-complementar/${id}`);
    router.refresh();
  }

  return (
    <LayoutDesktop breadcrumbLabels={material ? { 2: material.title } : undefined}>
      <section className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Editar material de apoio</h1>
          <p className="text-sm text-gray-500 md:text-base">
            Atualize as informações e o endereço de acesso ao conteúdo.
          </p>
        </div>

        {loading ? (
          <PageFeedback message="Carregando material de apoio..." />
        ) : material ? (
          <SupportMaterialForm
            initialValues={material}
            submitLabel="Salvar alterações"
            successMessage="Material de apoio atualizado com sucesso."
            onSubmit={updateMaterial}
          />
        ) : (
          <PageFeedback variant="error" message={error || "Material de apoio não encontrado."} />
        )}

        {!loading && !material && (
          <Button href="/maquinas/material-complementar" variant="secondary">
            Voltar para materiais
          </Button>
        )}
      </section>
    </LayoutDesktop>
  );
}
