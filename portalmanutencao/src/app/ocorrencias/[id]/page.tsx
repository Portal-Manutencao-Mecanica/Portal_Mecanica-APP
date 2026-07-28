"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { MaintenanceRequestApi } from "@/lib/api/types";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";

export default function OccurrenceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<MaintenanceRequestApi | null>(null);

  useEffect(() => {
    maintenanceRequestService.getById(id).then(setRequest).catch(() => setRequest(null));
  }, [id]);

  return (
    <LayoutDesktop>
      {!request ? <p className="ui-surface p-8 text-gray-500">Carregando ocorrência...</p> : (
        <div className="ui-page">
          <div className="flex items-center justify-between">
            <div><h1 className="text-3xl font-bold">Ocorrência {request.id}</h1><p className="text-gray-500">Detalhes da solicitação de manutenção.</p></div>
            <LabelWithCircle status="default" text={request.status} />
          </div>
          <div className="ui-surface grid gap-6 p-8 md:grid-cols-2">
            <Detail label="Máquina" value={request.machineName} />
            <Detail label="Local" value={request.placeName} />
            <Detail label="Professor notificado" value={request.notifiedTeacherName} />
            <Detail label="Setor" value={request.sector} />
            <Detail label="Prioridade" value={request.priority} />
            <Detail label="Data" value={new Intl.DateTimeFormat("pt-BR").format(new Date(request.createdAt))} />
            <div className="md:col-span-2"><Detail label="Descrição" value={request.description} /></div>
          </div>
        </div>
      )}
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-semibold">{value || "-"}</p></div>;
}
