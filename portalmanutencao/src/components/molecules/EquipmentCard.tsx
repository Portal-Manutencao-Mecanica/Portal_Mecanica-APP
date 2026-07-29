import Link from "next/link";

import Button from "@/components/atoms/Button";

import type { Equipment } from "@/lib/api/types";

interface Props {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {equipment.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            <span className="font-medium">SAP:</span> {equipment.sap || "-"}
          </p>

          <p className="text-sm text-gray-500">
            <span className="font-medium">Quantidade:</span> {equipment.availableQuantity}
          </p>

          <p className="text-sm text-gray-500">
            <span className="font-medium">Valor unitário:</span>{" "}
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(equipment.unitPrice)}
          </p>
        </div>

        <Link href={`/equipamentos/${equipment.id}`}>
          <Button>Ver detalhes</Button>
        </Link>
      </div>
    </div>
  );
}
