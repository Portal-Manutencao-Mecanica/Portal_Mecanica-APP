"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type { Student } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { studentService } from "@/services/studentService";
import { userService } from "@/services/userService";

type StatusAction = "deactivate" | "reactivate" | null;

export default function StudentPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [statusAction, setStatusAction] = useState<StatusAction>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    studentService
      .getById(id)
      .then(setStudent)
      .catch((error) =>
        toast.error(
          getServiceErrorMessage(error, "Não foi possível carregar o aluno."),
        ),
      );
  }, [id]);

  async function changeStatus() {
    if (!student || !statusAction) return;

    setSubmitting(true);
    try {
      if (statusAction === "deactivate") {
        await userService.deactivate(student.id);
        setStudent((current) =>
          current ? { ...current, enabled: false } : current,
        );
        toast.success("Aluno inativado com sucesso.");
      } else {
        await userService.reactivate(student.id);
        setStudent((current) =>
          current ? { ...current, enabled: true } : current,
        );
        toast.success("Aluno reativado com sucesso.");
      }
      setStatusAction(null);
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível alterar o status."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!student) {
    return (
      <LayoutDesktop>
        <p className="p-8 text-center text-gray-500">Carregando aluno...</p>
      </LayoutDesktop>
    );
  }

  const isAdmin = user?.role === "ADMIN";
  const canDeactivate =
    student.enabled && (isAdmin || user?.role === "COORDENADOR");

  return (
    <LayoutDesktop breadcrumbLabels={{ 1: student.name }}>
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Perfil do aluno</h1>
            <p className="text-gray-500">Informações cadastradas.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {canDeactivate ? (
              <Button
                variant="danger"
                onClick={() => setStatusAction("deactivate")}
              >
                Inativar
              </Button>
            ) : null}
            {isAdmin && !student.enabled ? (
              <Button onClick={() => setStatusAction("reactivate")}>
                Reativar
              </Button>
            ) : null}
            {isAdmin ? (
              <Button
                href={`/alunos/${student.id}/editar`}
                variant="warning"
              >
                Editar
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 rounded-xl border bg-white p-6 md:grid-cols-2">
          <Detail label="Nome" value={student.name} />
          <Detail label="Número do crachá" value={student.numberCard} />
          <Detail label="E-mail" value={student.email} />
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <LabelWithCircle
              status={student.enabled ? "positive" : "negative"}
              text={student.enabled ? "Ativo" : "Inativo"}
            />
          </div>
          <Detail
            label="Turmas vinculadas"
            value={
              student.classGroupIds.length
                ? String(student.classGroupIds.length)
                : "Nenhuma"
            }
          />
        </div>
      </div>

      <ConfirmDialog
        open={statusAction !== null}
        title={statusAction === "reactivate" ? "Reativar aluno" : "Inativar aluno"}
        description={
          statusAction === "reactivate"
            ? "O aluno voltará a acessar o sistema. Deseja continuar?"
            : "O aluno perderá o acesso ao sistema. Deseja continuar?"
        }
        confirmText={submitting ? "Salvando..." : "Confirmar"}
        confirmVariant={statusAction === "deactivate" ? "danger" : "primary"}
        onCancel={() => !submitting && setStatusAction(null)}
        onConfirm={changeStatus}
      />
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
