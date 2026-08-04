"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import PageFeedback from "@/components/molecules/PageFeedback";
import AutonomousMaintenanceForm from "@/components/organisms/AutonomousMaintenanceForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { AutonomousMaintenance } from "@/lib/api/types";
import { autonomousMaintenanceService } from "@/services/autonomousMaintenanceService";
import { getServiceErrorMessage } from "@/services/httpService";

export default function EditAutonomousMaintenancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [maintenance, setMaintenance] = useState<AutonomousMaintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    autonomousMaintenanceService
      .getById(id)
      .then((result) => {
        if (active) setMaintenance(result);
      })
      .catch((loadError) => {
        if (!active) return;
        const message = getServiceErrorMessage(
          loadError,
          "Não foi possível carregar a manutenção autônoma.",
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
    <LayoutDesktop
      breadcrumbLabels={maintenance ? { 1: maintenance.inspectedMachineName } : undefined}
    >
      {loading ? (
        <PageFeedback message="Carregando manutenção autônoma..." />
      ) : maintenance ? (
        <AutonomousMaintenanceForm maintenance={maintenance} />
      ) : (
        <PageFeedback
          variant="error"
          message={error || "Manutenção autônoma não encontrada."}
        />
      )}
    </LayoutDesktop>
  );
}
