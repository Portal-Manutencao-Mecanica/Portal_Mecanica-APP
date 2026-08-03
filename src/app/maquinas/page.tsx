"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
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
      <div className="space-y-6">
        <PageHeader
          title="Máquinas"
          description="Visualize todas as máquinas cadastradas."
          actions={<Link href="/maquinas/criar"><Button>Nova máquina</Button></Link>}
        />
        {loading ? (
          <PageFeedback message="Carregando máquinas..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <MachineTable machines={machines} />
        )}
      </div>
    </LayoutDesktop>
  );
}
