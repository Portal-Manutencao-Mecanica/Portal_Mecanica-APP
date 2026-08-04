"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import { useAuth } from "@/hooks/useAuth";
import type { Machine, MaintenanceType, TaskCriticality, TaskSituation } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineLogService } from "@/services/machineLogService";

const logSchema = v.object({
  title: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe um título para o log.")),
  description: v.string(),
  servicePerformed: v.string(),
  plannedAction: v.string(),
  reportLink: v.string(),
  taskSituation: v.picklist(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"]),
  taskCriticality: v.picklist(["BAIXA", "MEDIA", "ALTA"]),
  maintenanceType: v.union([
    v.literal(""),
    v.picklist(["PREVENTIVA", "CORRETIVA", "PREDITIVA", "AUTONOMA"]),
  ]),
});

type FormState = {
  title: string;
  description: string;
  servicePerformed: string;
  plannedAction: string;
  reportLink: string;
  taskSituation: TaskSituation;
  taskCriticality: TaskCriticality;
  maintenanceType: "" | MaintenanceType;
};

const initialForm: FormState = {
  title: "",
  description: "",
  servicePerformed: "",
  plannedAction: "",
  reportLink: "",
  taskSituation: "PENDENTE",
  taskCriticality: "MEDIA",
  maintenanceType: "",
};

function optional(value: string) {
  return value.trim() || undefined;
}

export default function MachineLogForm({ machine }: { machine: Machine }) {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const result = v.safeParse(logSchema, form);
    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise os dados do log.");
      return;
    }

    setSubmitting(true);
    try {
      await machineLogService.create({
        title: result.output.title,
        description: optional(result.output.description),
        servicePerformed: optional(result.output.servicePerformed),
        plannedAction: optional(result.output.plannedAction),
        reportLink: optional(result.output.reportLink),
        taskSituation: result.output.taskSituation,
        taskCriticality: result.output.taskCriticality,
        maintenanceType: result.output.maintenanceType || undefined,
        machineId: machine.id,
        placeId: machine.placeId,
        responsibleTeacherId: user?.role === "PROFESSOR" ? user.id : undefined,
        assignedStudentIds: [],
      });
      toast.success("Log da máquina registrado com sucesso.");
      router.push(`/maquinas/${machine.id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível registrar o log da máquina."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          id="machine-log-title"
          label="Título *"
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
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
        />
        <DropDown
          id="machine-log-criticality"
          label="Criticidade *"
          defaultSelection="Selecione a criticidade"
          enumData={{ BAIXA: "Baixa", MEDIA: "Média", ALTA: "Alta" }}
          value={form.taskCriticality}
          onSelect={(value) => update("taskCriticality", value as TaskCriticality)}
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
          onSelect={(value) => update("maintenanceType", value as "" | MaintenanceType)}
        />
      </div>

      <TextArea
        label="Descrição"
        value={form.description}
        onChange={(event) => update("description", event.target.value)}
        rows={4}
        maxLength={2000}
      />
      <TextArea
        label="Serviço realizado"
        value={form.servicePerformed}
        onChange={(event) => update("servicePerformed", event.target.value)}
        rows={3}
        maxLength={2000}
      />
      <TextArea
        label="Ação planejada"
        value={form.plannedAction}
        onChange={(event) => update("plannedAction", event.target.value)}
        rows={3}
        maxLength={2000}
      />
      <Input
        id="machine-log-report-link"
        label="Link do relatório"
        type="url"
        value={form.reportLink}
        onChange={(event) => update("reportLink", event.target.value)}
        placeholder="https://..."
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button href={`/maquinas/${machine.id}`} variant="secondary">Cancelar</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Registrando..." : "Registrar log"}
        </Button>
      </div>
    </form>
  );
}
