"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";

export default function EquipmentDetailsPage() {
  const router = useRouter();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const equipment = {
    id: "1",
    name: "Motor WEG 2CV",
    sap: "123456",
    numberCard: "EQ-0001",
    tag: "TAG-001",
    patrimony: "PAT-458963",
    image: "/images/default-equipment.png",
  };

  function handleDelete() {
    console.log("Equipamento excluído:", equipment.id);

    // Futuramente:
    // await api.delete(`/equipment/${equipment.id}`);

    setOpenDeleteDialog(false);

    router.push("/equipamentos");
  }

  return (
    <LayoutDesktop>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{equipment.name}</h1>

            <p className="text-gray-500">
              Informações do equipamento.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href={`/equipamentos/${equipment.id}/editar`}>
              <Button>
                Editar
              </Button>
            </Link>

            <Button
              variant="danger"
              onClick={() => setOpenDeleteDialog(true)}
            >
              Deletar
            </Button>
          </div>
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-gray-500">
                  Nome
                </p>

                <h2 className="text-xl font-semibold">
                  {equipment.name}
                </h2>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Código SAP
                </p>

                <p className="text-lg">
                  {equipment.sap || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Número do Card
                </p>

                <p className="text-lg">
                  {equipment.numberCard}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Tag
                </p>

                <p className="text-lg">
                  {equipment.tag || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Patrimônio
                </p>

                <p className="text-lg">
                  {equipment.patrimony || "-"}
                </p>
              </div>

            </div>
          </div>
        </div>

        <ConfirmDialog
          open={openDeleteDialog}
          title="Excluir Equipamento"
          description="Tem certeza que deseja excluir este equipamento? Esta ação não poderá ser desfeita."
          onCancel={() => setOpenDeleteDialog(false)}
          onConfirm={handleDelete}
        />
      </div>
    </LayoutDesktop>
  );
}