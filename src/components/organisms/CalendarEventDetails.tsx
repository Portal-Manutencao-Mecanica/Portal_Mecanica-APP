"use client";

import { Pencil, Trash2 } from "lucide-react";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import {
  criticalityLabels,
  maintenanceTypeLabels,
  statusLabels,
} from "@/components/organisms/CalendarEventForm";
import type { CalendarResponseDto } from "@/types/CalendarEvent";

interface CalendarEventDetailsProps {
  event: CalendarResponseDto;
  canManage: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CalendarEventDetails({
  event,
  canManage,
  onClose,
  onEdit,
  onDelete,
}: CalendarEventDetailsProps) {
  const statusVariant = event.status === "CONCLUIDA"
    ? "positive"
    : event.status === "EM_ANDAMENTO"
      ? "warning"
      : "info";

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-1 gap-5 rounded-xl border border-gray-200 bg-gray-50 p-5 md:grid-cols-2">
        <Detail label="Data programada" value={formatDateTime(event.scheduledFor)} />
        <div>
          <dt className="text-sm font-medium text-gray-500">Situação</dt>
          <dd className="mt-1">
            <LabelWithCircle status={statusVariant} text={statusLabels[event.status]} />
          </dd>
        </div>
        <Detail label="Criticidade" value={criticalityLabels[event.criticality]} />
        <Detail label="Tipo de manutenção" value={maintenanceTypeLabels[event.maintenanceType]} />
        <Detail label="Máquina" value={event.machineName || "Não informada"} />
        <Detail label="Equipamento" value={event.equipmentName || "Não informado"} />
        <Detail label="Local" value={event.placeName || "Não informado"} />
        <Detail label="Professor responsável" value={event.teacherName || "Não informado"} />
        <Detail label="Aluno responsável" value={event.studentName || "Não informado"} />
        <Detail
          label="Solicitado em"
          value={event.requestedAt ? formatDateTime(event.requestedAt) : "Não informado"}
        />
      </dl>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>Fechar</Button>
        {canManage && (
          <>
            <Button type="button" icon={Pencil} onClick={onEdit}>Editar</Button>
            <Button type="button" variant="danger" icon={Trash2} onClick={onDelete}>
              Excluir
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}
