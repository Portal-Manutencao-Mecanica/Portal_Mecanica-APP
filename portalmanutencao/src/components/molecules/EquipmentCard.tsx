import Image from "next/image";
import Link from "next/link";

import Button from "@/components/atoms/Button";

interface Equipment {
  id: string;
  name: string;
  sap?: string;
  numberCard: string;
  image?: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-52 w-full bg-gray-100">
        <Image
          src={equipment.image || "/images/default-equipment.png"}
          alt={equipment.name}
          fill
          className="object-contain p-4"
        />
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h2 className="text-lg font-semibold">{equipment.name}</h2>

          <p className="text-sm text-gray-500">SAP: {equipment.sap ?? "-"}</p>

          <p className="text-sm text-gray-500">Card: {equipment.numberCard}</p>
        </div>

        <Link href={`/equipamentos/${equipment.id}`}>
          <Button className="w-full">Ver Detalhes</Button>
        </Link>
      </div>
    </div>
  );
}
