"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import { StudentCard } from "@/components/molecules/StudentCard";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { ClassGroup } from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";

interface Props { params: Promise<{ id: string }>; }

export default function ClassGroupPage({ params }: Props) {
  const { id } = use(params);
  const [classGroup, setClassGroup] = useState<ClassGroup | null>(null);

  useEffect(() => {
    classGroupBrowserService.getById(id).then(setClassGroup).catch((error) => {
      toast.error(getServiceErrorMessage(error, "Não foi possível carregar a turma."));
    });
  }, [id]);

  if (!classGroup) {
    return <LayoutDesktop><p className="p-8 text-center text-gray-500">Carregando turma...</p></LayoutDesktop>;
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl space-y-6 p-8">
        <Link href="/turmas"><Button variant="secondary">Voltar</Button></Link>

        <div className="mb-10 mt-5 rounded-xl border border-t-8 border-gray-200 border-t-weg-blue bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Turma {classGroup.acronym}</h1>
          <p className="mt-2 text-gray-600"><span className="font-semibold">Professores:</span> {classGroup.teachers.map((teacher) => teacher.name).join(", ") || "Não informado"}</p>
        </div>

        <div className="space-y-4">
          {classGroup.students.length ? classGroup.students.map((student) => (
            <StudentCard key={student.id} classGroupId={id} studentId={student.id} name={student.name} />
          )) : <p className="rounded-xl border bg-white p-6 text-gray-500">Nenhum aluno vinculado a esta turma.</p>}
        </div>
      </div>
    </LayoutDesktop>
  );
}
