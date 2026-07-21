"use client";

import Link from "next/link";
import Button from "../atoms/Button";
import { DataRowCardProps } from "@/props/DataRowCardProps";

export function DataRowCard({
  acronym,
  professors,
  classGroupId,
}: DataRowCardProps) {
  return (
    <div className="flex items-center justify-between w-full rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col gap-1">
        <span className="text-xl font-semibold text-gray-800">{acronym}</span>

        <span className="text-sm text-gray-500">Professores</span>

        <span className="text-gray-700">{professors.join(", ")}</span>
      </div>

      <Link href={`/turmas/${classGroupId}`}>
        <Button>Ver alunos</Button>
      </Link>
    </div>
  );
}
