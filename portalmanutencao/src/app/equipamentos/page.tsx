"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/Input";
import EquipmentCard from "@/components/molecules/EquipmentCard";
import type { Equipment } from "@/lib/api/types";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";

export default function EquipmentsPage() {
  const [search, setSearch] = useState("");
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    equipmentService.list().then(setEquipments).catch((requestError) => {
      setError(getServiceErrorMessage(requestError, "Falha ao carregar equipamentos."));
    });
  }, []);

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
          {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
          {filteredEquipments.map((equipment) => (
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
