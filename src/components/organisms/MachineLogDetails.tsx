"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageHeader from "@/components/molecules/PageHeader";
import type { Machine, MachineLog } from "@/lib/api/types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const situationLabels = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
} as const;

const criticalityLabels = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
} as const;

const maintenanceTypeLabels = {
  PREVENTIVA: "Preventiva",
  CORRETIVA: "Corretiva",
  PREDITIVA: "Preditiva",
  AUTONOMA: "Autônoma",
} as const;

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "Não informada";
}

interface MachineLogDetailsProps {
  machine: Machine;
  log: MachineLog;
  assignedStudentNames: string[];
  canManage: boolean;
  onDelete: () => void;
}

export default function MachineLogDetails({
  machine,
  log,
  assignedStudentNames,
  canManage,
  onDelete,
}: MachineLogDetailsProps) {
  const status = log.taskSituation === "CONCLUIDA"
    ? "positive"
    : log.taskSituation === "EM_ANDAMENTO"
      ? "info"
      : "warning";

  return (
    <section className="space-y-6">
      <PageHeader
        title={log.title || "Registro do diário"}
        description={`Diário da máquina ${machine.name}`}
        actions={canManage ? (
          <>
            <Button
              href={`/maquinas/${machine.id}/logs/${log.id}/editar`}
              icon={Pencil}
            >
              Editar log
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              iconOnly
              aria-label={`Excluir log ${log.title || "do diário"}`}
              title="Excluir log"
              onClick={onDelete}
            />
          </>
        ) : undefined}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Detail label="Situação">
            <LabelWithCircle status={status} text={situationLabels[log.taskSituation]} />
          </Detail>
          <Detail label="Criticidade">{criticalityLabels[log.taskCriticality]}</Detail>
          <Detail label="Tipo de manutenção">
            {log.maintenanceType
              ? maintenanceTypeLabels[log.maintenanceType]
              : "Não informado"}
          </Detail>
          <Detail label="Registrado em">{formatDate(log.registeredAt)}</Detail>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InfoCard title="Contexto">
          <Detail label="Máquina">{machine.name}</Detail>
          <Detail label="Local">{log.placeName || "Não informado"}</Detail>
          <Detail label="Professor responsável">
            {log.responsibleTeacherName || "Não informado"}
          </Detail>
          <Detail label="Turma">{log.classGroupAcronym || "Não informada"}</Detail>
          <Detail label="Alunos designados">
            {assignedStudentNames.length
              ? assignedStudentNames.join(", ")
              : "Nenhum aluno designado"}
          </Detail>
        </InfoCard>

        <InfoCard title="Período da execução">
          <Detail label="Início">{formatDate(log.executionStartedAt)}</Detail>
          <Detail label="Fim">{formatDate(log.executionEndedAt)}</Detail>
          <Detail label="Conclusão do professor">
            {formatDate(log.teacherConcludedAt)}
          </Detail>
          {log.maintenanceRequestId ? (
            <Button
              href={`/ocorrencias/${log.maintenanceRequestId}`}
              variant="secondary"
            >
              Ver ocorrência relacionada
            </Button>
          ) : null}
        </InfoCard>
      </section>

      <InfoCard title="Descrição e execução">
        <TextDetail label="Descrição" value={log.description} />
        <TextDetail label="Serviço realizado" value={log.servicePerformed} />
        <TextDetail label="Ação planejada" value={log.plannedAction} />
        <TextDetail label="Relatório de execução" value={log.executionReport} />
        {log.reportLink ? (
          <a
            href={log.reportLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-weg-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weg-blue"
          >
            Abrir relatório
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </InfoCard>
    </section>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {children}
    </section>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 font-medium text-gray-800">{children}</div>
    </div>
  );
}

function TextDetail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700">{label}</h3>
      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
        {value || "Não informado"}
      </p>
    </div>
  );
}
