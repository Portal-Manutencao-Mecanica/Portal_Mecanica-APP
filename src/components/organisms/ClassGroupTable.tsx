"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";

import Button from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import type { ColumnProps } from "@/props/ColumnProps";

export interface ClassGroupTableItem {
  id: string;
  acronym: string;
  enabled: boolean;
  teachers: { id: string; name: string; email: string }[];
  students: { id: string; name: string; email: string }[];
}

interface ClassGroupTableProps {
  classGroups: ClassGroupTableItem[];
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export default function ClassGroupTable({
  classGroups,
  statusFilter,
  onStatusFilterChange,
}: ClassGroupTableProps) {
  const columns: ColumnProps<ClassGroupTableItem>[] = [
    { header: "Sigla", accessorKey: "acronym" },
    {
      header: "Status",
      render: (group) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${group.enabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
          {group.enabled ? "Ativa" : "Inativa"}
        </span>
      ),
    },
    { header: "Professores", render: (group) => group.teachers.map((teacher) => teacher.name).join(", ") || "Não informado" },
    { header: "Alunos", render: (group) => group.students.length, align: "center" },
    {
      header: "Ações",
      align: "right",
      render: (group) => (
        <div className="flex justify-end gap-2">
          <Button href={`/turmas/${group.id}?turma=${encodeURIComponent(group.acronym)}`} variant="secondary" icon={Eye} iconOnly aria-label={`Visualizar turma ${group.acronym}`} title="Visualizar turma" />
          <Link href={{ pathname: `/turmas/${group.id}/editar`, query: { turma: group.acronym } }}>
            <Button icon={Pencil}>Editar</Button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      data={classGroups}
      columns={columns}
      searchKeys={["acronym"]}
      searchPlaceholder="Pesquisar turma..."
      emptyMessage="Nenhuma turma encontrada."
      toggleOptions={[
        { label: "Todas", value: "ALL" },
        { label: "Ativas", value: "ACTIVE" },
        { label: "Inativas", value: "INACTIVE" },
      ]}
      toggleValue={statusFilter}
      onToggleChange={onStatusFilterChange}
    />
  );
}
