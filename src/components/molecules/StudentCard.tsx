"use client";

import Link from "next/link";

import Button from "../atoms/Button";

interface StudentCardProps {
  classGroupId: number;
  studentId: number;
  name: string;
}

export function StudentCard({
  classGroupId,
  studentId,
  name,
}: StudentCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-gray-500">ID do aluno: {studentId}</p>
      </div>

      <Link href={`/turmas/${classGroupId}/${studentId}`}>
        <Button>Ver perfil</Button>
      </Link>
    </div>
  );
}
