"use client";

import { Eye, Pencil } from "lucide-react";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import DataTable from "@/components/organisms/DataTable";
import type { Machine } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";

interface MachineTableProps {
  machines: Machine[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  condition: "" | Machine["condition"];
  onConditionChange: (value: "" | Machine["condition"]) => void;
  canManage: boolean;
}

export function MachineTable({
  machines,
  searchValue,
  onSearchChange,
  condition,
  onConditionChange,
  canManage,
}: MachineTableProps) {
  const columns: ColumnProps<Machine>[] = [
    { header: "Patrimônio", accessorKey: "patrimony" },
    { header: "Nome", accessorKey: "name" },
    { header: "Local", accessorKey: "placeName" },
    {
      header: "Condição",
      render: (machine) => (
        <LabelWithCircle
          status={machine.condition === "CONFORME" ? "positive" : "negative"}
          text={machine.condition === "CONFORME" ? "Conforme" : "Não conforme"}
        />
      ),
    },
    { header: "Tag", render: (machine) => machine.tag || "Não informada" },
    {
      header: "Ações",
      align: "right",
      render: (machine) => (
        <div className="flex justify-end gap-2">
          <Button
            href={`/maquinas/${machine.id}`}
            variant="secondary"
            icon={Eye}
            iconOnly
            aria-label={`Visualizar máquina ${machine.name}`}
            title="Visualizar máquina"
          />
          {canManage && (
            <Button
              href={`/maquinas/${machine.id}/editar`}
              icon={Pencil}
              iconOnly
              aria-label={`Editar máquina ${machine.name}`}
              title="Editar máquina"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={machines}
      columns={columns}
      searchKeys={["patrimony", "name", "placeName", "tag"]}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Pesquisar por nome, patrimônio, local ou TAG..."
      emptyMessage="Nenhuma máquina encontrada."
      filterElement={
        <div className="w-full sm:w-56">
          <DropDown
            id="machine-condition-filter"
            defaultSelection="Todas as condições"
            enumData={{ CONFORME: "Conforme", NAO_CONFORME: "Não conforme" }}
            value={condition}
            onSelect={(value) => onConditionChange(value as "" | Machine["condition"])}
          />
        </div>
      }
    />
  );
}