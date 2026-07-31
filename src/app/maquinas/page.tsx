"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Button from "@/components/atoms/Button";
import { MachineTable } from "@/components/organisms/MachineTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMachines() {
      try {
        const page = await machineService.list();
        setMachines(page.content);
      } catch (loadError) {
        setError(getServiceErrorMessage(loadError, "Não foi possível carregar as máquinas."));
      } finally {
        setLoading(false);
      }
    }

    void loadMachines();
  }, []);

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Máquinas</h1>
            <p className="text-gray-500">Visualize todas as máquinas cadastradas.</p>
          </div>

          <Link href="/maquinas/criar">
            <Button>Nova máquina</Button>
          </Link>
        </div>

        {loading ? (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Carregando máquinas...
          </p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
        ) : (
          <MachineTable machines={machines} />
        )}
      </div>
    </LayoutDesktop>
  );
}
