"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import { useAuth } from "@/hooks/useAuth";
import type {
  AutonomousMaintenance,
  AutonomousMaintenanceRequest,
  Machine,
  Student,
  Teacher,
} from "@/lib/api/types";
import {
  canCreateAutonomousMaintenance,
  canManageAutonomousMaintenance,
} from "@/lib/permissions";
import { autonomousMaintenanceService } from "@/services/autonomousMaintenanceService";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";
import { studentService } from "@/services/studentService";
import { teacherService } from "@/services/teacherService";

const formSchema = v.object({
  equipmentSituation: v.picklist(["OPERANDO", "NAO_OPERANDO"]),
  scheduledFor: v.pipe(
    v.string(),
    v.nonEmpty("Informe a data e a hora planejadas."),
  ),
  inspectedAt: v.string(),
  inspectedMachineId: v.pipe(
    v.string(),
    v.uuid("Selecione uma máquina válida."),
  ),
  equipmentCondition: v.picklist(["CONFORME", "NAO_CONFORME"]),
  identifiedNonconformities: v.pipe(
    v.string(),
    v.maxLength(5000, "Use no máximo 5000 caracteres."),
  ),
  studentIds: v.pipe(
    v.array(v.string()),
    v.minLength(1, "Selecione pelo menos um aluno."),
  ),
  responsibleTeacherId: v.string(),
});

type FormState = {
  equipmentSituation: "OPERANDO" | "NAO_OPERANDO";
  scheduledFor: string;
  inspectedAt: string;
  inspectedMachineId: string;
  equipmentCondition: "CONFORME" | "NAO_CONFORME";
  identifiedNonconformities: string;
  studentIds: string[];
  responsibleTeacherId: string;
};

function toLocalDateTimeInput(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function defaultScheduledFor() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  return toLocalDateTimeInput(date);
}

function createInitialForm(maintenance?: AutonomousMaintenance): FormState {
  if (maintenance) {
    return {
      equipmentSituation: maintenance.equipmentSituation,
      scheduledFor: maintenance.scheduledFor.slice(0, 16),
      inspectedAt: maintenance.inspectedAt?.slice(0, 16) ?? "",
      inspectedMachineId: maintenance.inspectedMachineId,
      equipmentCondition: maintenance.equipmentCondition,
      identifiedNonconformities: maintenance.identifiedNonconformities ?? "",
      studentIds: maintenance.students.map((student) => student.id),
      responsibleTeacherId: maintenance.responsibleTeacherId,
    };
  }

  return {
    equipmentSituation: "OPERANDO",
    scheduledFor: defaultScheduledFor(),
    inspectedAt: "",
    inspectedMachineId: "",
    equipmentCondition: "CONFORME",
    identifiedNonconformities: "",
    studentIds: [],
    responsibleTeacherId: "",
  };
}

interface AutonomousMaintenanceFormProps {
  maintenance?: AutonomousMaintenance;
}
export default function AutonomousMaintenanceForm({
  maintenance,
}: AutonomousMaintenanceFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(() => createInitialForm(maintenance));
  const [machines, setMachines] = useState<Machine[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateLimits] = useState(() => ({
    minimumScheduledFor: defaultScheduledFor(),
    maximumInspectedAt: toLocalDateTimeInput(new Date()),
  }));

  useEffect(() => {
    async function loadOptions() {
      try {
        const [machinePage, activeStudents, classGroupPage, activeTeachers] = await Promise.all([
          machineService.list({ size: 100, sort: "name,asc" }),
          studentService.listActive({ size: 1000, sort: "name,asc" }),
          classGroupBrowserService.list({ size: 100, sort: "acronym,asc" }),
          teacherService.list(),
        ]);
        const teacherGroups = classGroupPage.content.filter(
          (group) =>
            group.enabled && group.teachers.some((teacher) => teacher.id === user?.id),
        );
        const linkedStudentIds = new Set(
          teacherGroups.flatMap((group) => group.students.map((student) => student.id)),
        );
        setMachines(machinePage.content);
        setTeachers(
          activeTeachers.filter((teacher) => teacher.enabled && teacher.accountNonLocked),
        );
        setStudents(
          activeStudents.content.filter(
            (student) =>
              student.enabled &&
              student.accountNonLocked &&
              (teacherGroups.length === 0 || linkedStudentIds.has(student.id)),
          ),
        );
      } catch (error) {
        toast.error(
          getServiceErrorMessage(
            error,
            "Não foi possível carregar máquinas e alunos.",
          ),
        );
      } finally {
        setIsLoadingOptions(false);
      }
    }

    if (canCreateAutonomousMaintenance(user?.role)) {
      void loadOptions();
    }
  }, [maintenance, user?.id, user?.role]);

  const filteredStudents = useMemo(() => {
    const search = studentSearch.trim().toLocaleLowerCase("pt-BR");
    if (!search) return students;
    return students.filter((student) =>
      [student.name, student.email, student.numberCard].some((value) =>
        value.toLocaleLowerCase("pt-BR").includes(search),
      ),
    );
  }, [studentSearch, students]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleStudent(studentId: string) {
    updateField(
      "studentIds",
      form.studentIds.includes(studentId)
        ? form.studentIds.filter((id) => id !== studentId)
        : [...form.studentIds, studentId],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = v.safeParse(formSchema, form);

    if (!validation.success) {
      toast.error(validation.issues[0]?.message ?? "Revise os dados informados.");
      return;
    }

    if (!maintenance && new Date(validation.output.scheduledFor).getTime() < Date.now() - 60_000) {
      toast.error("A data planejada não pode estar no passado.");
      return;
    }

    if (user?.role !== "PROFESSOR" && !validation.output.responsibleTeacherId) {
      toast.error("Selecione o professor responsável.");
      return;
    }

    const payload: AutonomousMaintenanceRequest = {
      ...validation.output,
      scheduledFor: validation.output.scheduledFor,
      inspectedAt: validation.output.inspectedAt
        ? validation.output.inspectedAt
        : null,
      identifiedNonconformities:
        validation.output.identifiedNonconformities.trim() || null,
      responsibleTeacherId: user?.role === "PROFESSOR"
        ? undefined
        : validation.output.responsibleTeacherId,
    };

    setIsSubmitting(true);
    try {
      const saved = maintenance
        ? await autonomousMaintenanceService.update(maintenance.id, payload)
        : await autonomousMaintenanceService.create(payload);
      toast.success(
        maintenance
          ? "Manutenção autônoma atualizada com sucesso."
          : "Manutenção autônoma enviada para aprovação.",
      );
      router.push(`/manutencao-autonoma/${saved.id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(
          error,
          maintenance
            ? "Não foi possível atualizar a manutenção autônoma."
            : "Não foi possível criar a manutenção autônoma.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit = maintenance
    ? canManageAutonomousMaintenance(user?.role)
    : canCreateAutonomousMaintenance(user?.role);

  if (!canSubmit) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        Você não possui permissão para {maintenance ? "editar" : "criar"} manutenções autônomas.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {maintenance ? "Editar manutenção autônoma" : "Nova manutenção autônoma"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {maintenance
              ? "Atualize os dados da atividade e salve as alterações."
              : "Planeje a atividade, atribua os alunos e envie para o coordenador."}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {user?.role !== "PROFESSOR" && (
            <DropDown
              id="autonomous-responsible-teacher"
              label="Professor responsável *"
              defaultSelection={isLoadingOptions ? "Carregando professores..." : "Selecione o professor"}
              enumData={Object.fromEntries(
                teachers.map((teacher) => [teacher.id, teacher.name]),
              )}
              value={form.responsibleTeacherId}
              onSelect={(value) => updateField("responsibleTeacherId", value)}
              disabled={isLoadingOptions}
            />
          )}
          <DropDown
            id="autonomous-machine"
            label="Máquina *"
            defaultSelection={isLoadingOptions ? "Carregando máquinas..." : "Selecione uma máquina"}
            enumData={Object.fromEntries(
              machines.map((machine) => [machine.id, `${machine.name} — ${machine.placeName}`]),
            )}
            value={form.inspectedMachineId}
            onSelect={(value) => updateField("inspectedMachineId", value)}
            disabled={isLoadingOptions}
          />

          <Input
            id="autonomous-scheduled-for"
            label="Data e hora planejadas *"
            type="datetime-local"
            value={form.scheduledFor}
            min={maintenance ? undefined : dateLimits.minimumScheduledFor}
            onChange={(event) => updateField("scheduledFor", event.target.value)}
          />

          <DropDown
            id="autonomous-situation"
            label="Situação da máquina *"
            defaultSelection="Selecione a situação"
            enumData={{ OPERANDO: "Operando", NAO_OPERANDO: "Não operando" }}
            value={form.equipmentSituation}
            onSelect={(value) =>
              updateField("equipmentSituation", value as FormState["equipmentSituation"])
            }
          />

          <DropDown
            id="autonomous-condition"
            label="Condição encontrada *"
            defaultSelection="Selecione a condição"
            enumData={{ CONFORME: "Conforme", NAO_CONFORME: "Não conforme" }}
            value={form.equipmentCondition}
            onSelect={(value) =>
              updateField("equipmentCondition", value as FormState["equipmentCondition"])
            }
          />

          <Input
            id="autonomous-inspected-at"
            label="Data real da inspeção"
            type="datetime-local"
            value={form.inspectedAt}
            max={dateLimits.maximumInspectedAt}
            onChange={(event) => updateField("inspectedAt", event.target.value)}
          />

          <div className="md:col-span-2">
            <TextArea
              label="Não conformidades identificadas"
              value={form.identifiedNonconformities}
              maxLength={5000}
              rows={5}
              onChange={(event) =>
                updateField("identifiedNonconformities", event.target.value)
              }
              placeholder="Descreva os pontos que precisam de atenção."
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Alunos responsáveis *</h2>
            <p className="text-sm text-gray-500">
              {form.studentIds.length} aluno(s) selecionado(s)
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={studentSearch}
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder="Buscar aluno"
              className="pl-6"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200">
          {isLoadingOptions ? (
            <p className="p-5 text-sm text-gray-500">Carregando alunos...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="p-5 text-sm text-gray-500">Nenhum aluno disponível.</p>
          ) : (
            filteredStudents.map((student) => (
              <label
                key={student.id}
                className="flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-0 hover:bg-blue-50/50"
              >
                <input
                  type="checkbox"
                  checked={form.studentIds.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="h-4 w-4 accent-weg-blue"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900">
                    {student.name}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {student.email} · Crachá {student.numberCard}
                  </span>
                </span>
              </label>
            ))
          )}
        </div>
      </section>

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoadingOptions}
          className="disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Salvando..."
            : maintenance
              ? "Salvar alterações"
              : "Enviar para aprovação"}
        </Button>
      </div>
    </form>
  );
}
