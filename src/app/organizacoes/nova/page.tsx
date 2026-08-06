"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageHeader from "@/components/molecules/PageHeader";
import OrganizationForm from "@/components/organisms/OrganizationForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { OrganizationPayload } from "@/lib/api/types";
import { organizationService } from "@/services/organizationService";

export default function CreateOrganizationPage() {
  const router = useRouter();

  async function createOrganization(payload: OrganizationPayload) {
    await organizationService.create(payload);
    toast.success("Organização cadastrada com sucesso.");
    router.push("/organizacoes");
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Nova organização"
          description="Preencha os dados para cadastrar uma organização."
        />
        <OrganizationForm mode="create" onSubmit={createOrganization} />
      </section>
    </LayoutDesktop>
  );
}
