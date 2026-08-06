"use client";

import { useRouter } from "next/navigation";

import ClassGroupForm from "@/components/organisms/ClassGroupForm";
import PageHeader from "@/components/molecules/PageHeader";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { CreateClassGroup } from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";

export default function CreateClassGroupPage() {
  const router = useRouter();

  async function createClassGroup(payload: CreateClassGroup) {
    const classGroup = await classGroupBrowserService.create(payload);
    router.push(`/turmas/${classGroup.id}`);
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Nova turma"
          description="Cadastre a turma e aloque alunos que ainda não possuem turma."
        />
        <ClassGroupForm
          cancelHref="/turmas"
          submitLabel="Cadastrar turma"
          successMessage="Turma cadastrada com sucesso."
          onSubmit={createClassGroup}
        />
      </section>
    </LayoutDesktop>
  );
}
