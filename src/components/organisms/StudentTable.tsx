"use client";

import { Eye } from "lucide-react";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import DataTable from "@/components/organisms/DataTable";
import type { Student } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";

interface StudentTableProps {
  students: Student[];
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function StudentTable({
  students,
  statusFilter,
  onStatusFilterChange,
}: StudentTableProps) {
  const columns: ColumnProps<Student>[] = [
    { header: "Nome", accessorKey: "name" },
    { header: "E-mail", accessorKey: "email" },
    { header: "Crachá", accessorKey: "numberCard" },
    {
      header: "Turmas",
      align: "center",
      render: (student) =>
        student.classGroupIds.length || "Sem turma",
    },
    {
      header: "Status",
      render: (student) => (
        <LabelWithCircle
          status={student.enabled ? "positive" : "negative"}
          text={student.enabled ? "Ativo" : "Inativo"}
        />
      ),
    },
    {
      header: "Ações",
      align: "right",
      render: (student) => (
        <Button href={`/alunos/${student.id}`} variant="secondary" icon={Eye} iconOnly aria-label={`Visualizar aluno ${student.name}`} title="Visualizar aluno" />
      ),
    },
  ];

  return (
    <DataTable
      data={students}
      columns={columns}
      searchKeys={["name", "email", "numberCard"]}
      searchPlaceholder="Pesquisar aluno..."
      emptyMessage="Nenhum aluno encontrado."
      toggleOptions={[
        { label: "Todos", value: "ALL" },
        { label: "Ativos", value: "ACTIVE" },
        { label: "Inativos", value: "INACTIVE" },
      ]}
      toggleValue={statusFilter}
      onToggleChange={onStatusFilterChange}
    />
  );
}
