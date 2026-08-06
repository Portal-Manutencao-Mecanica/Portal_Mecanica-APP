"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ClassGroupForm from "@/components/organisms/ClassGroupForm";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { ClassGroup, CreateClassGroup } from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditClassPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [classGroup, setClassGroup] = useState<ClassGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClassGroup() {
      try {
        setClassGroup(await classGroupBrowserService.getById(id));
      } catch (error) {
        toast.error(getServiceErrorMessage(error, "Não foi possível carregar a turma."));
      } finally {
        setLoading(false);
      }
    }

    void loadClassGroup();
  }, [id]);

  async function updateClassGroup(payload: CreateClassGroup) {
    await classGroupBrowserService.update(id, payload);
    router.push(`/turmas/${id}`);
    router.refresh();
  }

  return (
    <LayoutDesktop breadcrumbLabels={classGroup ? { 1: `Turma ${classGroup.acronym}` } : undefined}>
      <section className="space-y-6">
        <PageHeader
          title="Editar turma"
          description="Atualize a sigla, os professores e os alunos disponíveis da turma."
        />

        {loading ? (
          <PageFeedback message="Carregando dados da turma..." />
        ) : classGroup ? (
          <ClassGroupForm
            initialValues={classGroup}
            cancelHref={`/turmas/${id}`}
            submitLabel="Salvar alterações"
            successMessage="Turma atualizada com sucesso."
            onSubmit={updateClassGroup}
          />
        ) : (
          <PageFeedback variant="error" message="Turma não encontrada." />
        )}
      </section>
    </LayoutDesktop>
  );
}
