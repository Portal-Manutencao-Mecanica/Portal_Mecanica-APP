"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import type {
  ClassGroup,
  Machine,
  MachineLog,
  MaintenanceType,
  Place,
  TaskCriticality,
  TaskSituation,
  Teacher,
} from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineLogService } from "@/services/machineLogService";
import { placeService } from "@/services/placeService";
import { teacherService } from "@/services/teacherService";

const optionalText = (maximum: number) =>
  v.pipe(v.string(), v.maxLength(maximum, `Use no máximo ${maximum} caracteres.`));

const logSchema = v.pipe(
  v.object({
    title: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(3, "Informe um título para o log."),
      v.maxLength(150, "O título deve possuir no máximo 150 caracteres."),
    ),
    description: optionalText(2000),
    executionReport: optionalText(2000),
    servicePerformed: optionalText(2000),
    plannedAction: optionalText(2000),
    reportLink: v.union([
      v.literal(""),
      v.pipe(v.string(), v.url("Informe um link de relatório válido.")),
    ]),
    taskSituation: v.picklist(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"]),
    taskCriticality: v.picklist(["BAIXA", "MEDIA", "ALTA"]),
    maintenanceType: v.union([
      v.literal(""),
      v.picklist(["PREVENTIVA", "CORRETIVA", "PREDITIVA", "AUTONOMA"]),
    ]),
    responsibleTeacherId: v.string(),
    placeId: v.string(),
    classGroupId: v.string(),
    executionStartedAt: v.string(),
    executionEndedAt: v.string(),
    teacherConcludedAt: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["executionStartedAt"], ["executionEndedAt"]],
      (input) =>
        !input.executionStartedAt ||
        !input.executionEndedAt ||
        input.executionEndedAt >= input.executionStartedAt,
      "O término deve ocorrer depois do início da execução.",
    ),
    ["executionEndedAt"],
  ),
);

type FormState = {
  title: string;
  description: string;
  executionReport: string;
  servicePerformed: string;
  plannedAction: string;
  reportLink: string;
  taskSituation: TaskSituation;
  taskCriticality: TaskCriticality;
  maintenanceType: "" | MaintenanceType;
  responsibleTeacherId: string;
  placeId: string;
  classGroupId: string;
  assignedStudentIds: string[];
  executionStartedAt: string;
  executionEndedAt: string;
  teacherConcludedAt: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function toDateTimeInput(value: string | null) {
  return value ? value.slice(0, 16) : "";
}

function initialForm(machine: Machine, log?: MachineLog): FormState {
  return {
    title: log?.title ?? "",
    description: log?.description ?? "",
    executionReport: log?.executionReport ?? "",
    servicePerformed: log?.servicePerformed ?? "",
    plannedAction: log?.plannedAction ?? "",
    reportLink: log?.reportLink ?? "",
    taskSituation: log?.taskSituation ?? "PENDENTE",
    taskCriticality: log?.taskCriticality ?? "MEDIA",
    maintenanceType: log?.maintenanceType ?? "",
    responsibleTeacherId: log?.responsibleTeacherId ?? "",
    placeId: log?.placeId ?? machine.placeId,
    classGroupId: log?.classGroupId ?? "",
    assignedStudentIds: log?.assignedStudentIds ?? [],
    executionStartedAt: toDateTimeInput(log?.executionStartedAt ?? null),
    executionEndedAt: toDateTimeInput(log?.executionEndedAt ?? null),
    teacherConcludedAt: toDateTimeInput(log?.teacherConcludedAt ?? null),
  };
}

function optional(value: string) {
  return value.trim() || undefined;
}

function fieldErrors(issues: v.BaseIssue<unknown>[]) {
  const errors: FormErrors = {};
  for (const issue of issues) {
    const key = issue.path?.[0]?.key;
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof FormState] = issue.message;
    }
  }
  return errors;
}

interface MachineLogFormProps {
  machine: Machine;
  initialValues?: MachineLog;
}

export default function MachineLogForm({
  machine,
  initialValues,
}: MachineLogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    initialForm(machine, initialValues),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [places, setPlaces] = useState<Place[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [referencesLoading, setReferencesLoading] = useState(true);
  const [referencesError, setReferencesError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const editing = Boolean(initialValues);

  useEffect(() => {
    let active = true;

    Promise.all([
      placeService.list(),
      teacherService.list(),
      classGroupBrowserService.list({ size: 100, sort: "acronym,asc" }),
    ])
      .then(([loadedPlaces, loadedTeachers, loadedClassGroups]) => {
        if (!active) return;
        setPlaces(loadedPlaces);
        setTeachers(loadedTeachers);
        setClassGroups(loadedClassGroups.content);
        setReferencesError("");
      })
      .catch((error) => {
        if (!active) return;
        setReferencesError(
          getServiceErrorMessage(
            error,
            "Não foi possível carregar os responsáveis, locais e turmas.",
          ),
        );
      })
      .finally(() => {
        if (active) setReferencesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedClassGroup = useMemo(
    () => classGroups.find((group) => group.id === form.classGroupId),
    [classGroups, form.classGroupId],
  );

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function updateClassGroup(classGroupId: string) {
    const selected = classGroups.find((group) => group.id === classGroupId);
    const studentIds = new Set(selected?.students.map((student) => student.id) ?? []);
    setForm((current) => ({
      ...current,
      classGroupId,
      assignedStudentIds: current.assignedStudentIds.filter((id) =>
        studentIds.has(id),
      ),
    }));
  }

  function toggleStudent(studentId: string, checked: boolean) {
    setForm((current) => ({
      ...current,
      assignedStudentIds: checked
        ? [...new Set([...current.assignedStudentIds, studentId])]
        : current.assignedStudentIds.filter((id) => id !== studentId),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const result = v.safeParse(logSchema, form);
    if (!result.success) {
      setErrors(fieldErrors(result.issues));
      toast.error(result.issues[0]?.message ?? "Revise os dados do log.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: result.output.title,
        description: optional(result.output.description),
        executionReport: optional(result.output.executionReport),
        servicePerformed: optional(result.output.servicePerformed),
        plannedAction: optional(result.output.plannedAction),
        reportLink: optional(result.output.reportLink),
        taskSituation: result.output.taskSituation,
        taskCriticality: result.output.taskCriticality,
        maintenanceType: result.output.maintenanceType || undefined,
        machineId: machine.id,
        placeId: optional(result.output.placeId),
        responsibleTeacherId: optional(result.output.responsibleTeacherId),
        classGroupId: optional(result.output.classGroupId),
        assignedStudentIds: form.assignedStudentIds,
        executionStartedAt: optional(result.output.executionStartedAt),
        executionEndedAt: optional(result.output.executionEndedAt),
        teacherConcludedAt: optional(result.output.teacherConcludedAt),
      };

      if (initialValues) {
        await machineLogService.update(initialValues.id, payload);
      } else {
        await machineLogService.create(payload);
      }

      toast.success(
        editing
          ? "Log da máquina atualizado com sucesso."
          : "Log da máquina registrado com sucesso.",
      );
      router.push(
        initialValues
          ? `/maquinas/${machine.id}/logs/${initialValues.id}`
          : `/maquinas/${machine.id}`,
      );
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(
          error,
          editing
            ? "Não foi possível atualizar o log da máquina."
            : "Não foi possível registrar o log da máquina.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const cancelHref = initialValues
    ? `/maquinas/${machine.id}/logs/${initialValues.id}`
    : `/maquinas/${machine.id}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Informações do registro</h2>
          <p className="mt-1 text-sm text-gray-500">
            Identifique a atividade e acompanhe sua situação no diário.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="machine-log-title"
            label="Título *"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            error={errors.title}
            maxLength={150}
            required
          />
          <DropDown
            id="machine-log-situation"
            label="Situação *"
            defaultSelection="Selecione a situação"
            enumData={{
              PENDENTE: "Pendente",
              EM_ANDAMENTO: "Em andamento",
              CONCLUIDA: "Concluída",
            }}
            value={form.taskSituation}
            onSelect={(value) => update("taskSituation", value as TaskSituation)}
            error={errors.taskSituation}
          />
          <DropDown
            id="machine-log-criticality"
            label="Criticidade *"
            defaultSelection="Selecione a criticidade"
            enumData={{ BAIXA: "Baixa", MEDIA: "Média", ALTA: "Alta" }}
            value={form.taskCriticality}
            onSelect={(value) =>
              update("taskCriticality", value as TaskCriticality)
            }
            error={errors.taskCriticality}
          />
          <DropDown
            id="machine-log-maintenance-type"
            label="Tipo de manutenção"
            defaultSelection="Não informado"
            enumData={{
              PREVENTIVA: "Preventiva",
              CORRETIVA: "Corretiva",
              PREDITIVA: "Preditiva",
              AUTONOMA: "Autônoma",
            }}
            value={form.maintenanceType}
            onSelect={(value) =>
              update("maintenanceType", value as "" | MaintenanceType)
            }
            error={errors.maintenanceType}
          />
        </div>

        <TextArea
          id="machine-log-description"
          label="Descrição"
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          error={errors.description}
          rows={4}
          maxLength={2000}
        />
      </section>

      <section className="space-y-5 border-t border-gray-200 pt-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Responsáveis e local</h2>
          <p className="mt-1 text-sm text-gray-500">
            Relacione o registro ao local, responsável e turma envolvidos.
          </p>
        </div>

        {referencesLoading && (
          <p className="text-sm text-gray-500" aria-live="polite">
            Carregando opções...
          </p>
        )}
        {referencesError && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {referencesError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DropDown
            id="machine-log-place"
            label="Local"
            defaultSelection="Não informado"
            enumData={Object.fromEntries(places.map((place) => [place.id, place.name]))}
            value={form.placeId}
            onSelect={(value) => update("placeId", value)}
            disabled={referencesLoading}
            error={errors.placeId}
          />
          <DropDown
            id="machine-log-teacher"
            label="Professor responsável"
            defaultSelection="Não informado"
            enumData={Object.fromEntries(
              teachers.map((teacher) => [teacher.id, teacher.name]),
            )}
            value={form.responsibleTeacherId}
            onSelect={(value) => update("responsibleTeacherId", value)}
            disabled={referencesLoading}
            error={errors.responsibleTeacherId}
          />
          <div className="md:col-span-2">
            <DropDown
              id="machine-log-class-group"
              label="Turma"
              defaultSelection="Não informada"
              enumData={Object.fromEntries(
                classGroups.map((group) => [group.id, group.acronym]),
              )}
              value={form.classGroupId}
              onSelect={updateClassGroup}
              disabled={referencesLoading}
              error={errors.classGroupId}
            />
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-gray-700">Alunos designados</legend>
          {!form.classGroupId ? (
            <p className="text-sm text-gray-500">Selecione uma turma para escolher os alunos.</p>
          ) : selectedClassGroup?.students.length ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {selectedClassGroup.students.map((student) => (
                <Checkbox
                  key={student.id}
                  id={`machine-log-student-${student.id}`}
                  label={student.name}
                  description={`Crachá ${student.numberCard}`}
                  checked={form.assignedStudentIds.includes(student.id)}
                  onChange={(event) => toggleStudent(student.id, event.target.checked)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">A turma selecionada não possui alunos.</p>
          )}
        </fieldset>
      </section>

      <section className="space-y-5 border-t border-gray-200 pt-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Execução e conclusão</h2>
          <p className="mt-1 text-sm text-gray-500">
            Registre períodos, serviço realizado e resultado da intervenção.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Input
            id="machine-log-started-at"
            label="Início da execução"
            type="datetime-local"
            value={form.executionStartedAt}
            onChange={(event) => update("executionStartedAt", event.target.value)}
            error={errors.executionStartedAt}
          />
          <Input
            id="machine-log-ended-at"
            label="Fim da execução"
            type="datetime-local"
            value={form.executionEndedAt}
            onChange={(event) => update("executionEndedAt", event.target.value)}
            error={errors.executionEndedAt}
          />
          <Input
            id="machine-log-concluded-at"
            label="Conclusão do professor"
            type="datetime-local"
            value={form.teacherConcludedAt}
            onChange={(event) => update("teacherConcludedAt", event.target.value)}
            error={errors.teacherConcludedAt}
          />
        </div>

        <TextArea
          id="machine-log-service-performed"
          label="Serviço realizado"
          value={form.servicePerformed}
          onChange={(event) => update("servicePerformed", event.target.value)}
          error={errors.servicePerformed}
          rows={3}
          maxLength={2000}
        />
        <TextArea
          id="machine-log-planned-action"
          label="Ação planejada"
          value={form.plannedAction}
          onChange={(event) => update("plannedAction", event.target.value)}
          error={errors.plannedAction}
          rows={3}
          maxLength={2000}
        />
        <TextArea
          id="machine-log-execution-report"
          label="Relatório de execução"
          value={form.executionReport}
          onChange={(event) => update("executionReport", event.target.value)}
          error={errors.executionReport}
          rows={4}
          maxLength={2000}
        />
        <Input
          id="machine-log-report-link"
          label="Link do relatório"
          type="url"
          value={form.reportLink}
          onChange={(event) => update("reportLink", event.target.value)}
          error={errors.reportLink}
          placeholder="https://..."
        />
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button href={cancelHref} variant="secondary">
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting || referencesLoading}>
          {submitting
            ? "Salvando..."
            : editing
              ? "Salvar alterações"
              : "Registrar log"}
        </Button>
      </div>
    </form>
  );
}
