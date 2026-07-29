"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import Button from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import type { ColumnProps } from "@/props/ColumnProps";

export interface ClassGroupTableItem { id: string; acronym: string; teachers: { id: string; name: string; email: string }[]; students: { id: string; name: string; email: string }[]; }

export default function ClassGroupTable({ classGroups }: { classGroups: ClassGroupTableItem[] }) {
  const columns: ColumnProps<ClassGroupTableItem>[] = [
    { header: "Sigla", accessorKey: "acronym" },
    { header: "Professores", render: (group) => group.teachers.map((teacher) => teacher.name).join(", ") || "Não informado" },
    { header: "Alunos", render: (group) => group.students.length, align: "center" },
    { header: "Ações", align: "right", render: (group) => <div className="flex justify-end gap-2"><Link href={`/turmas/${group.id}`}><Button variant="secondary" icon={Eye}>Visualizar</Button></Link><Link href={`/turmas/${group.id}/editar`}><Button icon={Pencil}>Editar</Button></Link></div> },
  ];
  return <DataTable data={classGroups} columns={columns} searchKeys={["acronym"]} searchPlaceholder="Pesquisar turma..." emptyMessage="Nenhuma turma encontrada." />;
}