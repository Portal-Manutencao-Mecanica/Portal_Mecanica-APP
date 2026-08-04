"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ClipboardCheck, ClipboardList, Edit, Trash2, Wrench, XCircle } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import SafeImage from "@/components/atoms/SafeImage";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type { MaintenanceRequestApi } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";
import type { LabelStatus } from "@/types/LabelStatus";

type Decision = "TEACHER_APPROVE" | "TEACHER_REJECT" | "COORDINATOR_APPROVE" | "COORDINATOR_REJECT";

const statusDetails: Record<string, { label: string; color: LabelStatus }> = {
  PENDENTE_APROVACAO_PROFESSOR: { label: "Aguardando professor", color: "warning" },
  REPROVADA_PELO_PROFESSOR: { label: "Reprovada pelo professor", color: "negative" },
  PENDENTE_APROVACAO_COORDENADOR: { label: "Aguardando coordenador", color: "warning" },
  APROVADA_PELO_COORDENADOR: { label: "Aprovada pelo coordenador", color: "positive" },
  REPROVADA_PELO_COORDENADOR: { label: "Reprovada pelo coordenador", color: "negative" },
  FINALIZADA: { label: "Finalizada", color: "positive" },
};

export default function OccurrenceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [request, setRequest] = useState<MaintenanceRequestApi | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = user?.role === "ADMIN";
  const canTeacherDecide = user?.role === "PROFESSOR" && user.id === request?.notifiedTeacherId && request.status === "PENDENTE_APROVACAO_PROFESSOR";
  const canCoordinatorDecide = user?.role === "COORDENADOR" && request?.status === "PENDENTE_APROVACAO_COORDENADOR";

  useEffect(() => {
    maintenanceRequestService
      .getById(id)
      .then(setRequest)
      .catch((error) => toast.error(getServiceErrorMessage(error, "Não foi possível carregar a ocorrência.")));
  }, [id]);

  async function deleteOccurrence() {
    try {
      setSubmitting(true);
      await maintenanceRequestService.remove(id);
      toast.success("Ocorrência excluída com sucesso.");
      router.push("/ocorrencias");
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível excluir a ocorrência."));
      setSubmitting(false);
      setConfirmingDelete(false);
    }
  }

  async function decide() {
    if (!pendingDecision) return;
    const approved = pendingDecision.endsWith("APPROVE");
    try {
      setSubmitting(true);
      const updated = pendingDecision.startsWith("TEACHER")
        ? await maintenanceRequestService.approve(id, { approved })
        : await maintenanceRequestService.approveWorkOrder(id, { approved });
      setRequest(updated);
      toast.success(approved ? "Aprovação registrada com sucesso." : "Reprovação registrada com sucesso.");
      setPendingDecision(null);
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível registrar a decisão."));
    } finally {
      setSubmitting(false);
    }
  }

  if (!request) {
    return <LayoutDesktop><p className="p-8 text-center text-gray-500">Carregando ocorrência...</p></LayoutDesktop>;
  }

  const status = statusDetails[request.status] ?? { label: request.status.replaceAll("_", " "), color: "warning" as LabelStatus };
  const teacherDecisionDone = request.status !== "PENDENTE_APROVACAO_PROFESSOR";
  const coordinatorDecisionDone = request.status === "APROVADA_PELO_COORDENADOR" || request.status === "REPROVADA_PELO_COORDENADOR";
  const decisionContent = pendingDecision && getDecisionContent(pendingDecision);

  return (
    <LayoutDesktop breadcrumbLabels={{ 1: request.machineName }}>
      <section className="space-y-6">
        <section className="rounded-xl bg-weg-card-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Solicitação de manutenção</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">{request.machineName}</h1>
              <p className="mt-1 text-sm text-gray-500">Registrada em {new Date(request.createdAt).toLocaleString("pt-BR")}</p>
            </div>
            <LabelWithCircle status={status.color} text={status.label} />
          </div>

          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <WorkflowStep label="Solicitação enviada" icon={ClipboardList} complete />
            <WorkflowStep label="Aprovação do professor" icon={CheckCircle2} complete={teacherDecisionDone} />
            <WorkflowStep label="Ordem de manutenção" icon={Wrench} complete={Boolean(request.workOrderNumber)} />
            <WorkflowStep label="Aprovação do coordenador" icon={ClipboardCheck} complete={coordinatorDecisionDone} />
          </ol>
        </section>

        <section className="grid grid-cols-1 gap-6 rounded-xl bg-weg-card-white p-6 shadow-sm md:grid-cols-2">
          <Detail label="Máquina" value={request.machineName} />
          <Detail label="Local" value={request.placeName} />
          <Detail label="Professor notificado" value={request.notifiedTeacherName} />
          <Detail label="Prioridade" value={request.priority} />
          <Detail label="Setor" value={request.sector} />
          <Detail label="Aprovação do professor" value={request.approvedByName || "Aguardando decisão"} />
          {request.approvedAt && <Detail label="Decisão do professor em" value={new Date(request.approvedAt).toLocaleString("pt-BR")} />}
          <div className="md:col-span-2"><Detail label="Descrição" value={request.description} /></div>
          {request.rejectionReason && <div className="md:col-span-2"><Detail label="Motivo da reprovação do professor" value={request.rejectionReason} /></div>}
        </section>

        {request.workOrderNumber && (
          <section className="rounded-xl bg-weg-card-white p-6 shadow-sm">
            <div className="flex items-center gap-2"><Wrench className="h-5 w-5 text-weg-blue" /><h2 className="text-lg font-semibold">Ordem de manutenção {request.workOrderNumber}</h2></div>
            <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <Detail label="Gerada por" value={request.workOrderCreatedByName || "Professor"} />
              <Detail label="Gerada em" value={request.workOrderCreatedAt ? new Date(request.workOrderCreatedAt).toLocaleString("pt-BR") : "Não informado"} />
              <Detail label="Decisão do coordenador" value={request.coordinatorApprovedByName || "Aguardando decisão"} />
              {request.coordinatorApprovedAt && <Detail label="Decidida em" value={new Date(request.coordinatorApprovedAt).toLocaleString("pt-BR")} />}
            </div>
            {request.coordinatorRejectionReason && <div className="mt-5"><Detail label="Motivo da reprovação do coordenador" value={request.coordinatorRejectionReason} /></div>}
          </section>
        )}

        {request.media?.length > 0 && (
          <section className="rounded-xl bg-weg-card-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Imagens da ocorrência</h2>
            <p className="mt-1 text-sm text-gray-500">Evidências enviadas no registro da ocorrência.</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {request.media.map((media) => (
                <a
                  key={media.id}
                  href={media.image}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-lg border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weg-blue focus-visible:ring-offset-2"
                  aria-label={`Abrir ${media.description || media.originalName}`}
                >
                  <SafeImage
                    src={media.image}
                    alt={media.description || media.originalName}
                    width={640}
                    height={420}
                    className="h-44 w-full object-cover"
                    unoptimized
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Link href="/ocorrencias"><Button variant="secondary">Voltar</Button></Link>
          {isAdmin && <Link href={`/ocorrencias/${request.id}/editar`}><Button icon={Edit}>Editar</Button></Link>}
          {isAdmin && <Button variant="danger" icon={Trash2} onClick={() => setConfirmingDelete(true)}>Excluir</Button>}
          {canTeacherDecide && <Button variant="danger" icon={XCircle} onClick={() => setPendingDecision("TEACHER_REJECT")}>Reprovar solicitação</Button>}
          {canTeacherDecide && <Button icon={CheckCircle2} onClick={() => setPendingDecision("TEACHER_APPROVE")}>Aprovar e gerar ordem</Button>}
          {canCoordinatorDecide && <Button variant="danger" icon={XCircle} onClick={() => setPendingDecision("COORDINATOR_REJECT")}>Reprovar ordem</Button>}
          {canCoordinatorDecide && <Button icon={CheckCircle2} onClick={() => setPendingDecision("COORDINATOR_APPROVE")}>Aprovar ordem</Button>}
        </div>
      </section>

      <ConfirmDialog open={confirmingDelete} title="Excluir ocorrência" description="Esta ação não pode ser desfeita. Deseja excluir esta ocorrência?" confirmText={submitting ? "Excluindo..." : "Excluir"} onCancel={() => !submitting && setConfirmingDelete(false)} onConfirm={deleteOccurrence} />
      {decisionContent && <ConfirmDialog open title={decisionContent.title} description={decisionContent.description} confirmText={submitting ? "Salvando..." : decisionContent.confirmText} onCancel={() => !submitting && setPendingDecision(null)} onConfirm={decide} />}
    </LayoutDesktop>
  );
}

function getDecisionContent(decision: Decision) {
  const approved = decision.endsWith("APPROVE");
  const isTeacher = decision.startsWith("TEACHER");
  return {
    title: approved ? isTeacher ? "Aprovar solicitação" : "Aprovar ordem" : isTeacher ? "Reprovar solicitação" : "Reprovar ordem",
    description: approved ? isTeacher ? "A aprovação gera uma ordem de manutenção para o coordenador." : "A ordem será marcada como aprovada pelo coordenador." : "A decisão será registrada e o solicitante será notificado.",
    confirmText: approved ? "Aprovar" : "Reprovar",
  };
}

function WorkflowStep({ label, icon: Icon, complete }: { label: string; icon: typeof ClipboardList; complete: boolean }) {
  return <li className={`flex items-center gap-3 rounded-lg border p-3 ${complete ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${complete ? "bg-weg-blue text-white" : "bg-gray-200 text-gray-500"}`}>{complete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span><span className="text-sm font-medium text-gray-700">{label}</span></li>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-gray-500">{label}</p><p className="font-medium">{value || "Não informado"}</p></div>;
}
