"use client";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import DataTable from "@/components/organisms/DataTable";
import type { Student } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
export function StudentTable({ students }: { students: Student[] }) { const columns: ColumnProps<Student>[] = [{ header: "Nome", accessorKey: "name" }, { header: "E-mail", accessorKey: "email" }, { header: "Crachá", accessorKey: "numberCard" }, { header: "Turmas", render: (student) => student.classGroupIds.length ? student.classGroupIds.length : "Sem turma" }, { header: "Status", render: (student) => <LabelWithCircle status={student.enabled ? "positive" : "negative"} text={student.enabled ? "Ativo" : "Inativo"} /> }, { header: "Ações", align: "right", render: (student) => <Link href={`/alunos/${student.id}`}><Button>Ver</Button></Link> }]; return <DataTable data={students} columns={columns} searchKeys={["name", "email", "numberCard"]} searchPlaceholder="Pesquisar aluno..." emptyMessage="Nenhum aluno encontrado." />; }