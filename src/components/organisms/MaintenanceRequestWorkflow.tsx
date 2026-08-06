"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardCheck, ClipboardList, Wrench, XCircle } from "lucide-react";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import { getStatusPresentation } from "@/lib/status";
import { MaintenanceRequest, MaintenanceRequestStatus } from "@/types/MaintenanceRequest";

type Action = "APPROVE_COORDINATOR" | "REJECT_COORDINATOR";

const priorityStyles = {
  BAIXA: "bg-slate-100 text-slate-700",
  MEDIA: "bg-blue-100 text-blue-700",
  ALTA: "bg-amber-100 text-amber-800",
  CRITICA: "bg-red-100 text-red-700",
};

function getActionContent(action: Action) {
  return action === "APPROVE_COORDINATOR"
    ? { title: "Aprovar conclusão", description: "A ocorrência será marcada como concluída.", confirm: "Aprovar conclusão" }
    : { title: "Reprovar conclusão", description: "A ordem será devolvida para ajustes e uma nova evidência deverá ser encaminhada.", confirm: "Reprovar" };
}

export default function MaintenanceRequestWorkflow({ request }: { request: MaintenanceRequest }) {
  const [status, setStatus] = useState<MaintenanceRequestStatus>(request.status);
  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const statusDetail = getStatusPresentation(status);
  const dialogContent = pendingAction ? getActionContent(pendingAction) : null;
  const steps = [
    { label: "Solicitação do aluno", icon: ClipboardList, complete: true },
    { label: "Aprovação do professor", icon: CheckCircle2, complete: true },
    { label: "Ordem de manutenção", icon: Wrench, complete: true },
    { label: "Aprovação do coordenador", icon: ClipboardCheck, complete: status === "CONCLUIDA" },
  ];

  function confirmAction() {
    if (!pendingAction) return;
    setStatus(pendingAction === "APPROVE_COORDINATOR" ? "CONCLUIDA" : "REPROVADA_PELO_COORDENADOR");
    setPendingAction(null);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Ordem encaminhada pelo professor</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">{request.numberCard}</h1>
            <p className="mt-1 text-sm text-gray-500">Recebida em {request.createdAt}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${priorityStyles[request.priority]}`}>{request.priority}</span>
            <LabelWithCircle status={statusDetail.color} text={statusDetail.label} />
          </div>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.label} className={`flex items-center gap-3 rounded-lg border p-3 ${step.complete ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${step.complete ? "bg-weg-blue text-white" : "bg-gray-200 text-gray-500"}`}>
                  {step.complete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className="text-sm font-medium text-gray-700">{index + 1}. {step.label}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-lg font-semibold text-gray-900">Solicitação aprovada pelo professor</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Máquina" value={request.machine} />
          <Detail label="Local" value={request.place} />
          <Detail label="Setor" value={request.sector} />
          <Detail label="Solicitante" value={request.createdBy} />
          <Detail label="Professor responsável" value={request.notifiedTeacher} />
          <Detail label="Aprovada pelo professor em" value={request.teacherApprovedAt} />
        </div>
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Descrição informada</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">{request.description}</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-weg-blue" />
          <h2 className="text-lg font-semibold text-gray-900">Ordem de manutenção {request.workOrder.number}</h2>
        </div>
        <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
          <Detail label="Responsável pela execução" value={request.workOrder.technician} />
          <Detail label="Conclusão informada em" value={request.workOrder.completedAt} />
        </div>
        <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">{request.workOrder.description}</div>
      </section>

      {status === "AGUARDANDO_APROVACAO_COORDENADOR" && (
        <section className="flex flex-wrap justify-end gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <Button variant="danger" icon={XCircle} onClick={() => setPendingAction("REJECT_COORDINATOR")}>Reprovar conclusão</Button>
          <Button icon={CheckCircle2} onClick={() => setPendingAction("APPROVE_COORDINATOR")}>Aprovar conclusão</Button>
        </section>
      )}

      {dialogContent && (
        <ConfirmDialog
          open={Boolean(pendingAction)}
          title={dialogContent.title}
          description={dialogContent.description}
          confirmText={dialogContent.confirm}
          onCancel={() => setPendingAction(null)}
          onConfirm={confirmAction}
        />
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-800">{value}</p>
    </div>
  );
}
