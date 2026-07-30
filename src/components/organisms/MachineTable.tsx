"use client";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import DataTable from "@/components/organisms/DataTable";
import type { Machine } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
export function MachineTable({ machines }: { machines: Machine[] }) { const columns: ColumnProps<Machine>[] = [{ header: "Patrimônio", accessorKey: "patrimony" }, { header: "Nome", accessorKey: "name" }, { header: "Local", accessorKey: "placeName" }, { header: "Condição", render: (machine) => <LabelWithCircle status={machine.condition === "ATIVA" ? "positive" : machine.condition === "MANUTENCAO" ? "warning" : "negative"} text={machine.condition === "ATIVA" ? "Ativa" : machine.condition === "MANUTENCAO" ? "Em manutenção" : "Inativa"} /> }, { header: "Tag", accessorKey: "tag" }, { header: "Ações", align: "right", render: (machine) => <div className="flex justify-end gap-2"><Link href={`/maquinas/${machine.id}`}><Button>Ver</Button></Link><Link href={`/maquinas/${machine.id}/editar`}><Button variant="warning">Editar</Button></Link></div> }]; return <DataTable data={machines} columns={columns} searchKeys={["patrimony", "name", "placeName", "tag"]} searchPlaceholder="Pesquisar máquina..." emptyMessage="Nenhuma máquina encontrada." />; }