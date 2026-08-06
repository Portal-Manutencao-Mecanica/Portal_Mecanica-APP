"use client";

import Link from "next/link";

import Button from "../atoms/Button";

interface StudentCardProps {
  classGroupId: string;
  classGroupName: string;
  studentId: string;
  name: string;
}

export function StudentCard({
  classGroupId,
  classGroupName,
  studentId,
  name,
}: StudentCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-gray-500">Perfil de {name}</p>
      </div>

      <Link href={{
        pathname: `/turmas/${classGroupId}/${studentId}`,
        query: { turma: classGroupName, aluno: name },
      }}>
        <Button>Ver perfil</Button>
      </Link>
    </div>
  );
}
