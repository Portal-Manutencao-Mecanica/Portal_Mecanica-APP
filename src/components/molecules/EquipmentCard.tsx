import { Eye } from "lucide-react";

import Button from "@/components/atoms/Button";

import { EquipmentProps } from "../../props/EquipmentProps";

interface Props {
  equipment: EquipmentProps;
}

export default function EquipmentCard({ equipment }: Props) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(equipment.unitPrice);

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
            <span className="font-medium">Preço unitário:</span> {formattedPrice}
          </p>

          <p className="text-sm text-gray-500">
            <span className="font-medium">Quantidade disponível:</span>{" "}
            {equipment.availableQuantity}
          </p>
        </div>

        <Button href={`/equipamentos/${equipment.id}`} variant="secondary" icon={Eye} iconOnly aria-label={`Visualizar equipamento ${equipment.name}`} title="Visualizar equipamento" />
      </div>
    </div>
  );
}
