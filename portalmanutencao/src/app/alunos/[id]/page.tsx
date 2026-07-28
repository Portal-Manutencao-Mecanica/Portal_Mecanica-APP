"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Student } from "@/lib/api/types";
import { studentService } from "@/services/studentService";

export default function StudentPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    studentService.getById(id).then(setStudent).catch(() => setStudent(null));
  }, [id]);

  return (
    <LayoutDesktop>
      {!student ? (
        <p className="ui-surface p-8 text-gray-500">Carregando aluno...</p>
      ) : (
        <div className="ui-page">
          <div className="ui-surface border-t-8 border-t-weg-blue p-6 md:p-8">
            <h1 className="text-3xl font-bold">Perfil do Aluno</h1>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <Detail label="Nome" value={student.name} />
              <Detail label="Número do crachá" value={student.numberCard} />
              <Detail label="E-mail" value={student.email} />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <LabelWithCircle status={student.enabled ? "positive" : "negative"} text={student.enabled ? "Ativo" : "Inativo"} />
              </div>
            </div>
          </div>
          <div className="ui-surface p-6 md:p-8">
            <h2 className="mb-5 text-2xl font-semibold">IDs das turmas</h2>
            <div className="flex flex-wrap gap-2">
              {student.classGroupIds.map((classId) => (
                <span key={classId} className="rounded-lg bg-weg-blue px-4 py-2 text-sm text-white">{classId}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-semibold">{value || "-"}</p></div>;
}
