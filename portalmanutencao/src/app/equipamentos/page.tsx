"use client";

import { useState } from "react";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/Input";
import EquipmentCard from "@/components/molecules/EquipmentCard";
import { EquipmentProps } from "../../props/EquipmentProps"

const equipments: EquipmentProps[] = [
  {
    id: "1",
    name: "Motor WEG 2CV",
    sap: "123456",
    numberCard: "EQ-0001",
    image: "/images/equipment.png",
  },
  {
    id: "2",
    name: "Rolamento SKF",
    sap: "987654",
    numberCard: "EQ-0002",
    image: "/images/equipment.png",
  },
];

export default function EquipmentsPage() {
  const [search, setSearch] = useState("");
<<<<<<< HEAD
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    equipmentService.list()
      .then(setEquipments)
      .catch((requestError: unknown) => {
        setError(getServiceErrorMessage(requestError, "Falha ao carregar equipamentos."));
      })
      .finally(() => setIsLoading(false));
  }, []);
=======
>>>>>>> origin/develop

  const filteredEquipments = equipments.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(search.toLowerCase()) ||
      (equipment.sap ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LayoutDesktop>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Equipamentos</h1>

            <p className="text-gray-500">
              Gerencie todos os equipamentos cadastrados.
            </p>
          </div>

          <Link href="/equipamentos/novo">
            <Button>Novo Equipamento</Button>
          </Link>
        </div>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar equipamento..."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
<<<<<<< HEAD
          {isLoading && <p className='text-gray-500'>Carregando equipamentos...</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
          {!isLoading && !error && filteredEquipments.length === 0 && (
            <p className='rounded-lg border border-gray-200 bg-white p-6 text-gray-600'>
              Nenhum equipamento encontrado.
            </p>
          )}
          {!isLoading && !error && filteredEquipments.map((equipment) => (
=======
          {filteredEquipments.map((equipment) => (
>>>>>>> origin/develop
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
            />
          ))}
        </div>
      </div>
    </LayoutDesktop>
  );
}