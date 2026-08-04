"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ClassGroupForm from "@/components/organisms/ClassGroupForm";
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
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Editar turma</h1>
          <p className="mt-1 text-sm text-gray-500">Atualize a sigla e os membros da turma.</p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">Carregando dados da turma...</div>
        ) : classGroup ? (
          <ClassGroupForm
            initialValues={classGroup}
            cancelHref={`/turmas/${id}`}
            submitLabel="Salvar alterações"
            successMessage="Turma atualizada com sucesso."
            onSubmit={updateClassGroup}
          />
        ) : (
          <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">Turma não encontrada.</p>
        )}
      </div>
    </LayoutDesktop>
  );
}
