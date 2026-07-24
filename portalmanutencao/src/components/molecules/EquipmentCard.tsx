import Image from "next/image";
import Link from "next/link";

import Button from "@/components/atoms/Button";

import { EquipmentProps } from "../../props/EquipmentProps";

interface Props {
  equipment: EquipmentProps;
}

export default function EquipmentCard({ equipment }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:shadow-md">
      <div className="relative h-56 w-full bg-gray-100">
        <Image
          src={equipment.image || "/images/default-equipment.png"}
          alt={equipment.name}
          fill
          className="object-contain p-4"
        />
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {equipment.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            <span className="font-medium">SAP:</span> {equipment.sap || "-"}
          </p>

          <p className="text-sm text-gray-500">
            <span className="font-medium">Card:</span> {equipment.numberCard}
          </p>

          {equipment.tag && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Tag:</span> {equipment.tag}
            </p>
          )}

          {equipment.patrimony && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">Patrimônio:</span>{" "}
              {equipment.patrimony}
            </p>
          )}
        </div>

        <Link href={`/equipamentos/${equipment.id}`}>
          <Button>Ver detalhes</Button>
        </Link>
      </div>
    </div>
  );
}
