"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageFeedback from "@/components/molecules/PageFeedback";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import MachineLogDetails from "@/components/organisms/MachineLogDetails";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import { useMachineLog } from "@/hooks/useMachineLog";
import { canManageMachines } from "@/lib/permissions";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineLogService } from "@/services/machineLogService";

interface PageProps {
  params: Promise<{ id: string; logId: string }>;
}

export default function MachineLogPage({ params }: PageProps) {
  const { id, logId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { machine, log, error, loading } = useMachineLog(id, logId);
  const [assignedStudentResult, setAssignedStudentResult] = useState<{
    key: string;
    names: string[];
  }>({ key: "", names: [] });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const classGroupId = log?.classGroupId;
  const assignedStudentKey = log?.assignedStudentIds.join(",") ?? "";
  const assignedStudentRequestKey = `${classGroupId ?? ""}:${assignedStudentKey}`;
  const assignedStudentNames = assignedStudentResult.key === assignedStudentRequestKey
    ? assignedStudentResult.names
    : [];

  useEffect(() => {
    if (!classGroupId || !assignedStudentKey) {
      return;
    }

    let active = true;
    classGroupBrowserService
      .getById(classGroupId)
      .then((classGroup) => {
        if (!active) return;
        const assignedIds = new Set(assignedStudentKey.split(","));
        setAssignedStudentResult({
          key: assignedStudentRequestKey,
          names: classGroup.students
            .filter((student) => assignedIds.has(student.id))
            .map((student) => student.name),
        });
      })
      .catch(() => {
        if (active) {
          setAssignedStudentResult({ key: assignedStudentRequestKey, names: [] });
        }
      });

    return () => {
      active = false;
    };
  }, [assignedStudentKey, assignedStudentRequestKey, classGroupId]);

  async function removeLog() {
    if (!log || deleting) return;
    setDeleting(true);
    try {
      await machineLogService.remove(log.id);
      toast.success("Log excluído com sucesso.");
      router.push(`/maquinas/${id}`);
      router.refresh();
    } catch (deleteError) {
      toast.error(
        getServiceErrorMessage(deleteError, "Não foi possível excluir o log."),
      );
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  const labels = machine && log
    ? { 1: machine.name, 2: "Diário", 3: log.title || "Registro" }
    : undefined;

  return (
    <LayoutDesktop breadcrumbLabels={labels}>
      {loading ? (
        <PageFeedback message="Carregando registro do diário..." />
      ) : machine && log ? (
        <>
          <MachineLogDetails
            machine={machine}
            log={log}
            assignedStudentNames={assignedStudentNames}
            canManage={canManageMachines(user?.role)}
            onDelete={() => setDeleteOpen(true)}
          />
          <ConfirmDialog
            open={deleteOpen}
            title="Excluir log do diário"
            description={`Tem certeza que deseja excluir ${log.title || "este registro"}?`}
            confirmText="Excluir log"
            confirmVariant="danger"
            confirming={deleting}
            onCancel={() => setDeleteOpen(false)}
            onConfirm={removeLog}
          />
        </>
      ) : (
        <PageFeedback
          variant="error"
          message={error || "Registro do diário não encontrado."}
        />
      )}
    </LayoutDesktop>
  );
}
