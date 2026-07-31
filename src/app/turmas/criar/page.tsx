"use client";

import { useRouter } from "next/navigation";

import ClassGroupForm from "@/components/organisms/ClassGroupForm";
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
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Nova turma</h1>
          <p className="mt-1 text-sm text-gray-500">Cadastre a turma e aloque seus alunos e professores.</p>
        </div>
        <ClassGroupForm
          cancelHref="/turmas"
          submitLabel="Cadastrar turma"
          successMessage="Turma cadastrada com sucesso."
          onSubmit={createClassGroup}
        />
      </div>
    </LayoutDesktop>
  );
}
