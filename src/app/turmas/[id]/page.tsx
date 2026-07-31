"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Power } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import { StudentCard } from "@/components/molecules/StudentCard";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { ClassGroup } from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";

interface Props { params: Promise<{ id: string }>; }

export default function ClassGroupPage({ params }: Props) {
  const { id } = use(params);
  const [classGroup, setClassGroup] = useState<ClassGroup | null>(null);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    classGroupBrowserService.getById(id).then(setClassGroup).catch((error) => {
      toast.error(getServiceErrorMessage(error, "Não foi possível carregar a turma."));
    });
  }, [id]);

  async function deactivateClassGroup() {
    if (!classGroup || deactivating) return;

    setDeactivateDialogOpen(false);
    setDeactivating(true);
    try {
      setClassGroup(await classGroupBrowserService.deactivate(id));
      toast.success("Turma inativada com sucesso.");
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível inativar a turma."));
    } finally {
      setDeactivating(false);
    }
  }

  async function reactivateClassGroup() {
    if (!classGroup || !window.confirm(`Reativar a turma ${classGroup.acronym}?`)) return;

    setReactivating(true);
    try {
      setClassGroup(await classGroupBrowserService.reactivate(id));
      toast.success("Turma reativada com sucesso.");
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível reativar a turma."));
    } finally {
      setReactivating(false);
    }
  }

  if (!classGroup) {
    return <LayoutDesktop><p className="p-8 text-center text-gray-500">Carregando turma...</p></LayoutDesktop>;
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl space-y-6 p-8">
        <div className="flex flex-wrap gap-3">
          <Link href={{ pathname: `/turmas/${id}/editar`, query: { turma: classGroup.acronym } }}>
            <Button icon={Pencil}>Editar turma</Button>
          </Link>
          {classGroup.enabled ? (
            <Button variant="danger" icon={Power} disabled={deactivating} onClick={() => setDeactivateDialogOpen(true)}>
              {deactivating ? "Inativando..." : "Inativar turma"}
            </Button>
          ) : (
            <Button icon={Power} disabled={reactivating} onClick={reactivateClassGroup}>
              {reactivating ? "Reativando..." : "Reativar turma"}
            </Button>
          )}
        </div>

        <div className="mb-10 mt-5 rounded-xl border border-t-8 border-gray-200 border-t-weg-blue bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold">Turma {classGroup.acronym}</h1><span className={`rounded-full px-3 py-1 text-sm font-semibold ${classGroup.enabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{classGroup.enabled ? "Ativa" : "Inativa"}</span></div>
          <p className="mt-2 text-gray-600"><span className="font-semibold">Professores:</span> {classGroup.teachers.map((teacher) => teacher.name).join(", ") || "Não informado"}</p>
        </div>

        <div className="space-y-4">
          {classGroup.students.length ? classGroup.students.map((student) => (
            <StudentCard key={student.id} classGroupId={id} classGroupName={classGroup.acronym} studentId={student.id} name={student.name} />
          )) : <p className="rounded-xl border bg-white p-6 text-gray-500">Nenhum aluno vinculado a esta turma.</p>}
        </div>
      </div>

      <ConfirmDialog
        open={deactivateDialogOpen}
        title="Inativar turma"
        description={`Tem certeza de que deseja inativar a turma ${classGroup.acronym}?`}
        confirmText="Inativar turma"
        confirmVariant="danger"
        onCancel={() => setDeactivateDialogOpen(false)}
        onConfirm={() => void deactivateClassGroup()}
      />
    </LayoutDesktop>
  );
}
