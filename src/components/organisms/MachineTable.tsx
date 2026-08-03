"use client";
import { Eye, Pencil } from "lucide-react";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import DataTable from "@/components/organisms/DataTable";
import type { Machine } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
export function MachineTable({ machines }: { machines: Machine[] }) { const columns: ColumnProps<Machine>[] = [{ header: "Patrimônio", accessorKey: "patrimony" }, { header: "Nome", accessorKey: "name" }, { header: "Local", accessorKey: "placeName" }, { header: "Condição", render: (machine) => <LabelWithCircle status={machine.condition === "CONFORME" ? "positive" : "negative"} text={machine.condition === "CONFORME" ? "Conforme" : "Não conforme"} /> }, { header: "Tag", accessorKey: "tag" }, { header: "Ações", align: "right", render: (machine) => <div className="flex justify-end gap-2"><Button href={`/maquinas/${machine.id}`} variant="secondary" icon={Eye} iconOnly aria-label={`Visualizar máquina ${machine.name}`} title="Visualizar máquina" /><Button href={`/maquinas/${machine.id}/editar`} icon={Pencil} iconOnly aria-label={`Editar máquina ${machine.name}`} title="Editar máquina" /></div> }]; return <DataTable data={machines} columns={columns} searchKeys={["patrimony", "name", "placeName", "tag"]} searchPlaceholder="Pesquisar máquina..." emptyMessage="Nenhuma máquina encontrada." />; }
