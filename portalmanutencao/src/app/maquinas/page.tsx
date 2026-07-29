"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import { MachineTable } from "@/components/organisms/MachineTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine } from "@/lib/api/types";
import { machineService } from "@/services/machineService";

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    machineService.list().then(setMachines).catch(() => setMachines([]));
  }, []);

  return (
    <LayoutDesktop>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        {/* O <Breadcrumbs /> foi removido daqui para não duplicar com o do LayoutDesktop */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Máquinas
            </h1>

            <p className="text-gray-500">
              Visualize todas as máquinas cadastradas.
            </p>
          </div>

          <Link href="/maquinas/criar">
            <Button>
              Nova Máquina
            </Button>
          </Link>
        </div>

        <MachineTable
          machines={machines.map((machine) => ({
            ...machine,
            place: machine.placeName,
          }))}
        />

      </div>
    </LayoutDesktop>
  );
}
