"use client";

import { useEffect, useState } from "react";

import type { Machine, MachineLog } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineLogService } from "@/services/machineLogService";
import { machineService } from "@/services/machineService";

export function useMachineLog(machineId: string, logId: string) {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [log, setLog] = useState<MachineLog | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      machineService.getById(machineId),
      machineLogService.getById(logId),
    ])
      .then(([loadedMachine, loadedLog]) => {
        if (!active) return;
        if (loadedLog.machineId !== loadedMachine.id) {
          setError("Este registro não pertence à máquina informada.");
          return;
        }
        setMachine(loadedMachine);
        setLog(loadedLog);
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          getServiceErrorMessage(
            loadError,
            "Não foi possível carregar o registro do diário.",
          ),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [logId, machineId]);

  return { machine, log, error, loading };
}
