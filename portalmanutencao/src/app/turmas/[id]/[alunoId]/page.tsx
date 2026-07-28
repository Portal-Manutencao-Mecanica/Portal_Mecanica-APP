"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { ClassGroup, Student } from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { studentService } from "@/services/studentService";

export default function StudentPage() {
  const { id, alunoId } = useParams<{ id: string; alunoId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [groups, setGroups] = useState<ClassGroup[]>([]);

  useEffect(() => {
    studentService.getById(alunoId).then(async (loadedStudent) => {
      setStudent(loadedStudent);
      const loadedGroups = await Promise.all(
        loadedStudent.classGroupIds.map((groupId) =>
          classGroupBrowserService.getById(groupId),
        ),
      );
      setGroups(loadedGroups);
    }).catch(() => setStudent(null));
  }, [alunoId]);

  return (
    <LayoutDesktop>
      {!student ? <p className="ui-surface p-8 text-gray-500">Carregando aluno...</p> : (
        <div className="ui-page">
          <Link href={`/turmas/${id}`}><Button>← Voltar</Button></Link>
          <div className="ui-surface grid gap-6 p-8 md:grid-cols-2">
            <Detail label="Nome" value={student.name} />
            <Detail label="Crachá" value={student.numberCard} />
            <Detail label="E-mail" value={student.email} />
            <div><p className="text-sm text-gray-500">Status</p><LabelWithCircle status={student.enabled ? "positive" : "negative"} text={student.enabled ? "Ativo" : "Inativo"} /></div>
          </div>
          <div className="ui-surface p-8">
            <h2 className="mb-5 text-2xl font-semibold">Turmas</h2>
            <div className="flex flex-wrap gap-3">
              {groups.map((group) => <Link key={group.id} href={`/turmas/${group.id}`} className="rounded-lg bg-weg-blue px-4 py-2 text-white">{group.acronym}</Link>)}
            </div>
          </div>
        </div>
      )}
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-semibold">{value}</p></div>;
}
