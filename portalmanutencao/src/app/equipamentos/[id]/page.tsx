import Image from "next/image";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";

export default function EquipmentDetailsPage() {
  const equipment = {
    id: "1",
    name: "Motor WEG 2CV",
    sap: "123456",
    numberCard: "EQ-0001",
    image: "/images/default-equipment.png",
  };

  return (
    <LayoutDesktop>
      <div className="space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{equipment.name}</h1>

            <p className="text-gray-500">Informações do equipamento.</p>
          </div>

          <Button>Editar</Button>
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="flex justify-center">
              <div className="relative h-80 w-80 rounded-xl border bg-gray-100">
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  className="object-contain p-6"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500">Nome</p>

                <h2 className="text-xl font-semibold">{equipment.name}</h2>
              </div>

              <div>
                <p className="text-sm text-gray-500">Código SAP</p>

                <p className="text-lg">{equipment.sap || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Número do Card</p>

                <p className="text-lg break-all">{equipment.numberCard}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDesktop>
  );
}
