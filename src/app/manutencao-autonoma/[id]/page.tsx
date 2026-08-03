"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { AutonomousMaintenanceStatusBadge } from "@/components/atoms/AutonomousMaintenanceStatusBadge";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type { AutonomousMaintenance } from "@/lib/api/types";
import { autonomousMaintenanceService } from "@/services/autonomousMaintenanceService";
import { getServiceErrorMessage } from "@/services/httpService";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

export default function AutonomousMaintenanceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState<AutonomousMaintenance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeciding, setIsDeciding] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    async function loadMaintenance() {
      try {
        setMaintenance(await autonomousMaintenanceService.getById(id));
      } catch (error) {
        toast.error(
          getServiceErrorMessage(
            error,
            "Não foi possível carregar a manutenção autônoma.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadMaintenance();
  }, [id]);

  async function decide(approved: boolean) {
    const reason = rejectionReason.trim();
    if (!approved && !reason) {
      toast.error("Informe o motivo da reprovação.");
      return;
    }

    setIsDeciding(true);
    try {
      const updated = await autonomousMaintenanceService.decide(id, {
        approved,
        reason: approved ? null : reason,
      });
      setMaintenance(updated);
      setShowRejection(false);
      toast.success(
        approved
          ? "Manutenção aprovada e adicionada ao calendário."
          : "Manutenção reprovada.",
      );
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível registrar a decisão."),
      );
    } finally {
      setIsDeciding(false);
    }
  }

  async function removeMaintenance() {
    if (!window.confirm("Deseja cancelar esta manutenção autônoma?")) return;

    try {
      await autonomousMaintenanceService.remove(id);
      toast.success("Manutenção autônoma cancelada.");
      router.replace("/manutencao-autonoma");
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível cancelar a manutenção."),
      );
    }
  }

  if (isLoading) {
    return (
      <LayoutDesktop>
        <p className="p-8 text-center text-sm text-gray-500">Carregando detalhes...</p>
      </LayoutDesktop>
    );
  }

  if (!maintenance) {
    return (
      <LayoutDesktop>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          Manutenção autônoma não encontrada ou indisponível para seu perfil.
        </div>
      </LayoutDesktop>
    );
  }

  const isPending = maintenance.status === "PENDENTE_APROVACAO_COORDENADOR";
  const canDelete = isPending &&
    (user?.role === "PROFESSOR" || user?.role === "ADMIN");

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-5xl space-y-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2">
              <AutonomousMaintenanceStatusBadge status={maintenance.status} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {maintenance.inspectedMachineName}
            </h1>
            <p className="mt-1 text-gray-500">
              Planejada para {dateTimeFormatter.format(new Date(maintenance.scheduledFor))}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {maintenance.calendarEventId && (
              <Link href="/calendario">
                <Button variant="secondary" icon={CalendarDays}>Ver calendário</Button>
              </Link>
            )}
            {canDelete && (
              <Button variant="danger" icon={Trash2} onClick={removeMaintenance}>
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <section className="grid gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-2">
          <Detail label="Professor responsável" value={maintenance.responsibleTeacherName} />
          <Detail
            label="Situação da máquina"
            value={maintenance.equipmentSituation === "OPERANDO" ? "Operando" : "Não operando"}
          />
          <Detail
            label="Condição"
            value={maintenance.equipmentCondition === "CONFORME" ? "Conforme" : "Não conforme"}
          />
          <Detail
            label="Inspeção realizada em"
            value={
              maintenance.inspectedAt
                ? dateTimeFormatter.format(new Date(maintenance.inspectedAt))
                : "Ainda não informada"
            }
          />
          <div className="sm:col-span-2">
            <Detail
              label="Não conformidades identificadas"
              value={maintenance.identifiedNonconformities || "Nenhuma informada"}
            />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Alunos responsáveis</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {maintenance.students.map((student) => (
              <div key={student.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
                <p className="mt-1 text-xs text-gray-400">Crachá {student.numberCard}</p>
              </div>
            ))}
          </div>
        </section>

        {maintenance.coordinatorApproverName && (
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Decisão do coordenador</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Coordenador" value={maintenance.coordinatorApproverName} />
              <Detail
                label="Data da decisão"
                value={
                  maintenance.approvedAt
                    ? dateTimeFormatter.format(new Date(maintenance.approvedAt))
                    : "Não informada"
                }
              />
              {maintenance.rejectionReason && (
                <div className="sm:col-span-2">
                  <Detail label="Motivo da reprovação" value={maintenance.rejectionReason} />
                </div>
              )}
            </div>
          </section>
        )}

        {user?.role === "COORDENADOR" && isPending && (
          <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Aprovação da manutenção</h2>
            <p className="mt-1 text-sm text-gray-600">
              Ao aprovar, os alunos serão notificados e o evento será incluído no calendário.
            </p>

            {showRejection && (
              <div className="mt-5">
                <TextArea
                  label="Motivo da reprovação *"
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Explique o motivo para o professor."
                />
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {showRejection ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowRejection(false);
                      setRejectionReason("");
                    }}
                    disabled={isDeciding}
                  >
                    Voltar
                  </Button>
                  <Button
                    variant="danger"
                    icon={X}
                    onClick={() => void decide(false)}
                    disabled={isDeciding}
                  >
                    {isDeciding ? "Registrando..." : "Confirmar reprovação"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="danger" icon={X} onClick={() => setShowRejection(true)}>
                    Reprovar
                  </Button>
                  <Button icon={Check} onClick={() => void decide(true)} disabled={isDeciding}>
                    {isDeciding ? "Aprovando..." : "Aprovar e agendar"}
                  </Button>
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{value}</p>
    </div>
  );
}
