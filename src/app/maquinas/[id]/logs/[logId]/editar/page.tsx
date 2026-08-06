"use client";

import { use } from "react";

import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import MachineLogForm from "@/components/organisms/MachineLogForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useMachineLog } from "@/hooks/useMachineLog";

interface PageProps {
  params: Promise<{ id: string; logId: string }>;
}

export default function EditMachineLogPage({ params }: PageProps) {
  const { id, logId } = use(params);
  const { machine, log, error, loading } = useMachineLog(id, logId);
  const labels = machine && log
    ? {
        1: machine.name,
        2: "Diário",
        3: log.title || "Registro",
        4: "Editar",
      }
    : undefined;

  return (
    <LayoutDesktop breadcrumbLabels={labels}>
      <section className="space-y-6">
        <PageHeader
          title="Editar log da máquina"
          description={machine
            ? `Atualize o registro do diário de ${machine.name}.`
            : "Atualize o registro do diário da máquina."}
        />
        {loading ? (
          <PageFeedback message="Carregando registro do diário..." />
        ) : machine && log ? (
          <MachineLogForm machine={machine} initialValues={log} />
        ) : (
          <PageFeedback
            variant="error"
            message={error || "Registro do diário não encontrado."}
          />
        )}
      </section>
    </LayoutDesktop>
  );
}
