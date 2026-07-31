"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { ClassGroup, Student } from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
import { studentService } from "@/services/studentService";

interface Props { params: Promise<{ id: string; alunoId: string }>; }

export default function StudentPage({ params }: Props) {
  const { alunoId } = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);

  useEffect(() => {
    async function loadStudent() {
      try {
        const loadedStudent = await studentService.getById(alunoId);
        setStudent(loadedStudent);
        setClassGroups(await Promise.all(loadedStudent.classGroupIds.map((classGroupId) => classGroupBrowserService.getById(classGroupId))));
      } catch (error) {
        toast.error(getServiceErrorMessage(error, "Não foi possível carregar o perfil do aluno."));
      }
    }

    void loadStudent();
  }, [alunoId]);

  if (!student) return <LayoutDesktop><p className="p-8 text-center text-gray-500">Carregando aluno...</p></LayoutDesktop>;

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl space-y-6 p-8">
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-3xl font-bold">Perfil do aluno</h1>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Detail label="Nome">{student.name}</Detail>
            <Detail label="Número do crachá">{student.numberCard}</Detail>
            <Detail label="E-mail">{student.email}</Detail>
            <Detail label="Cargo">{student.role}</Detail>
            <Detail label="Status"><LabelWithCircle status={student.enabled ? "positive" : "negative"} text={student.enabled ? "Ativo" : "Inativo"} /></Detail>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-5 text-2xl font-semibold">Turmas</h2>
          <div className="flex flex-wrap gap-3">
            {classGroups.map((group) => <Link key={group.id} href={{ pathname: `/turmas/${group.id}`, query: { turma: group.acronym } }} className="rounded-lg bg-weg-blue px-4 py-2 text-white">{group.acronym}</Link>)}
          </div>
        </div>
      </div>
    </LayoutDesktop>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-sm text-gray-500">{label}</p><div className="text-lg font-semibold">{children}</div></div>;
}
