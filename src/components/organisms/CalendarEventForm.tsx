"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import type {
  Equipment,
  Machine,
  MaintenanceType,
  Place,
  Student,
  TaskCriticality,
  TaskSituation,
  Teacher,
} from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import type { CalendarResponseDto } from "@/types/CalendarEvent";

const eventSchema = v.object({
  scheduledAction: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(3, "Informe a ação programada."),
    v.maxLength(500, "A ação deve possuir no máximo 500 caracteres."),
  ),
  criticality: v.picklist(["BAIXA", "MEDIA", "ALTA"]),
  scheduledFor: v.pipe(v.string(), v.nonEmpty("Informe a data e a hora.")),
  maintenanceType: v.picklist(["PREVENTIVA", "CORRETIVA", "PREDITIVA", "AUTONOMA"]),
  equipmentId: v.pipe(v.string(), v.uuid("Selecione um equipamento válido.")),
  machineId: v.pipe(v.string(), v.uuid("Selecione uma máquina válida.")),
  placeId: v.pipe(v.string(), v.uuid("Selecione um local válido.")),
  studentId: v.union([v.literal(""), v.pipe(v.string(), v.uuid("Selecione um aluno válido."))]),
  teacherId: v.pipe(v.string(), v.uuid("Selecione um professor válido.")),
  status: v.picklist(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"]),
});

export interface CalendarEventFormValues {
  scheduledAction: string;
  criticality: TaskCriticality;
  scheduledFor: string;
  maintenanceType: MaintenanceType;
  equipmentId: string;
  machineId: string;
  placeId: string;
  studentId: string;
  teacherId: string;
  status: TaskSituation;
}

interface CalendarEventFormProps {
  mode: "create" | "edit";
  initialValues?: CalendarResponseDto;
  defaultScheduledFor?: string;
  equipment: Equipment[];
  machines: Machine[];
  places: Place[];
  teachers: Teacher[];
  students: Student[];
  onCancel: () => void;
  onSubmit: (values: CalendarEventFormValues) => Promise<void>;
}

type FormErrors = Partial<Record<keyof CalendarEventFormValues, string>>;

const criticalityLabels: Record<TaskCriticality, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
};

const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  PREVENTIVA: "Preventiva",
  CORRETIVA: "Corretiva",
  PREDITIVA: "Preditiva",
  AUTONOMA: "Autônoma",
};

const statusLabels: Record<TaskSituation, string> = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
};

export default function CalendarEventForm({
  mode,
  initialValues,
  defaultScheduledFor = "",
  equipment,
  machines,
  places,
  teachers,
  students,
  onCancel,
  onSubmit,
}: CalendarEventFormProps) {
  const [scheduledAction, setScheduledAction] = useState(initialValues?.scheduledAction ?? "");
  const [criticality, setCriticality] = useState<TaskCriticality>(initialValues?.criticality ?? "MEDIA");
  const [scheduledFor, setScheduledFor] = useState(
    initialValues?.scheduledFor.slice(0, 16) ?? defaultScheduledFor,
  );
  const [maintenanceType, setMaintenanceType] = useState<MaintenanceType>(
    initialValues?.maintenanceType ?? "PREVENTIVA",
  );
  const [equipmentId, setEquipmentId] = useState(initialValues?.equipmentId ?? "");
  const [machineId, setMachineId] = useState(initialValues?.machineId ?? "");
  const [placeId, setPlaceId] = useState(initialValues?.placeId ?? "");
  const [studentId, setStudentId] = useState(initialValues?.studentId ?? "");
  const [teacherId, setTeacherId] = useState(initialValues?.teacherId ?? "");
  const [status, setStatus] = useState<TaskSituation>(initialValues?.status ?? "PENDENTE");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const equipmentOptions = useMemo(
    () => Object.fromEntries(equipment.map((item) => [item.id, item.name])),
    [equipment],
  );
  const machineOptions = useMemo(
    () => Object.fromEntries(machines.map((item) => [item.id, item.name])),
    [machines],
  );
  const placeOptions = useMemo(
    () => Object.fromEntries(places.map((item) => [item.id, item.name])),
    [places],
  );
  const teacherOptions = useMemo(
    () => Object.fromEntries(teachers.map((item) => [item.id, item.name])),
    [teachers],
  );
  const studentOptions = useMemo(
    () => Object.fromEntries(students.map((item) => [item.id, item.name])),
    [students],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(eventSchema, {
      scheduledAction,
      criticality,
      scheduledFor,
      maintenanceType,
      equipmentId,
      machineId,
      placeId,
      studentId,
      teacherId,
      status,
    });

    if (!result.success) {
      const nextErrors: FormErrors = {};
      for (const issue of result.issues) {
        const key = issue.path?.[0]?.key;
        if (typeof key === "string" && !(key in nextErrors)) {
          nextErrors[key as keyof CalendarEventFormValues] = issue.message;
        }
      }
      setErrors(nextErrors);
      toast.error(result.issues[0]?.message ?? "Revise os dados do evento.");
      return;
    }

    const scheduledForChanged = !initialValues
      || result.output.scheduledFor !== initialValues.scheduledFor.slice(0, 16);
    if (scheduledForChanged && new Date(result.output.scheduledFor).getTime() < Date.now()) {
      setErrors({ scheduledFor: "A data programada não pode estar no passado." });
      toast.error("A data programada não pode estar no passado.");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      await onSubmit(result.output);
    } catch (submitError) {
      toast.error(getServiceErrorMessage(submitError, "Não foi possível salvar o evento."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextArea
        id="calendar-scheduled-action"
        label="Ação programada *"
        value={scheduledAction}
        maxLength={500}
        error={errors.scheduledAction}
        onChange={(event) => setScheduledAction(event.target.value)}
        disabled={saving}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          id="calendar-scheduled-for"
          label="Data e hora *"
          type="datetime-local"
          value={scheduledFor}
          error={errors.scheduledFor}
          onChange={(event) => setScheduledFor(event.target.value)}
          disabled={saving}
        />
        <DropDown
          id="calendar-criticality"
          label="Criticidade *"
          defaultSelection="Selecione a criticidade"
          enumData={criticalityLabels}
          value={criticality}
          error={errors.criticality}
          onSelect={(value) => setCriticality(value as TaskCriticality)}
          disabled={saving}
        />
        <DropDown
          id="calendar-maintenance-type"
          label="Tipo de manutenção *"
          defaultSelection="Selecione o tipo"
          enumData={maintenanceTypeLabels}
          value={maintenanceType}
          error={errors.maintenanceType}
          onSelect={(value) => setMaintenanceType(value as MaintenanceType)}
          disabled={saving}
        />
        <DropDown
          id="calendar-status"
          label="Situação *"
          defaultSelection="Selecione a situação"
          enumData={statusLabels}
          value={status}
          error={errors.status}
          onSelect={(value) => setStatus(value as TaskSituation)}
          disabled={saving}
        />
        <DropDown
          id="calendar-equipment"
          label="Equipamento *"
          defaultSelection="Selecione um equipamento"
          enumData={equipmentOptions}
          value={equipmentId}
          error={errors.equipmentId}
          onSelect={setEquipmentId}
          disabled={saving}
        />
        <DropDown
          id="calendar-machine"
          label="Máquina *"
          defaultSelection="Selecione uma máquina"
          enumData={machineOptions}
          value={machineId}
          error={errors.machineId}
          onSelect={setMachineId}
          disabled={saving}
        />
        <DropDown
          id="calendar-place"
          label="Local *"
          defaultSelection="Selecione um local"
          enumData={placeOptions}
          value={placeId}
          error={errors.placeId}
          onSelect={setPlaceId}
          disabled={saving}
        />
        <DropDown
          id="calendar-teacher"
          label="Professor responsável *"
          defaultSelection="Selecione um professor"
          enumData={teacherOptions}
          value={teacherId}
          error={errors.teacherId}
          onSelect={setTeacherId}
          disabled={saving}
        />
        <div className="md:col-span-2">
          <DropDown
            id="calendar-student"
            label="Aluno responsável"
            defaultSelection="Nenhum aluno selecionado"
            enumData={studentOptions}
            value={studentId}
            error={errors.studentId}
            onSelect={setStudentId}
            disabled={saving}
            allowEmptySelection={mode === "create" || !initialValues?.studentId}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={saving} onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" icon={Save} disabled={saving}>
          {saving ? "Salvando..." : mode === "create" ? "Criar evento" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}

export { criticalityLabels, maintenanceTypeLabels, statusLabels };
