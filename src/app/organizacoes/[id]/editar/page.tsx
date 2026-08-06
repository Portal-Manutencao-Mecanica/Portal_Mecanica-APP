"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import OrganizationForm from "@/components/organisms/OrganizationForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Organization, OrganizationPayload } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { organizationService } from "@/services/organizationService";

export default function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    organizationService.getById(id)
      .then((result) => {
        if (active) setOrganization(result);
      })
      .catch((loadError) => {
        if (active) {
          setError(
            getServiceErrorMessage(loadError, "Não foi possível carregar a organização."),
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

  async function updateOrganization(payload: OrganizationPayload) {
    await organizationService.update(id, payload);
    toast.success("Organização atualizada com sucesso.");
    router.push("/organizacoes");
    router.refresh();
  }

  return (
    <LayoutDesktop breadcrumbLabels={organization ? { 1: organization.name } : undefined}>
      <section className="space-y-6">
        <PageHeader
          title="Editar organização"
          description="Atualize as informações cadastrais da organização."
        />
        {loading ? (
          <PageFeedback message="Carregando organização..." />
        ) : organization ? (
          <OrganizationForm
            mode="edit"
            initialValues={organization}
            onSubmit={updateOrganization}
          />
        ) : (
          <PageFeedback variant="error" message={error || "Organização não encontrada."} />
        )}
      </section>
    </LayoutDesktop>
  );
}
