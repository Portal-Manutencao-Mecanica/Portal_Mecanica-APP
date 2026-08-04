"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import MachineLogForm from "@/components/organisms/MachineLogForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";

export default function NewMachineLogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    machineService
      .getById(id)
      .then((result) => {
        if (active) setMachine(result);
      })
      .catch((loadError) => {
        if (!active) return;
        const message = getServiceErrorMessage(
          loadError,
          "Não foi possível carregar a máquina.",
        );
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <LayoutDesktop breadcrumbLabels={machine ? { 1: machine.name } : undefined}>
      <section className="space-y-6">
        <PageHeader
          title="Novo log de máquina"
          description={machine
            ? `Registre uma intervenção ou inspeção em ${machine.name}.`
            : "Registre uma intervenção ou inspeção."}
        />
        {loading ? (
          <PageFeedback message="Carregando máquina..." />
        ) : machine ? (
          <MachineLogForm machine={machine} />
        ) : (
          <PageFeedback variant="error" message={error || "Máquina não encontrada."} />
        )}
      </section>
    </LayoutDesktop>
  );
}
