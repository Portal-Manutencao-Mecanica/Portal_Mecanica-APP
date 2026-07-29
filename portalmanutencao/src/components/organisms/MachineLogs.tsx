"use client";

import { FormEvent, useEffect, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import { useAuth } from "@/hooks/useAuth";
import type { CreateMachineLog, Machine, MachineLog } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineLogService } from "@/services/machineLogService";

const initialForm = {
  title: "",
  plannedAction: "",
  description: "",
  servicePerformed: "",
  executionReport: "",
  taskSituation: "PENDENTE" as CreateMachineLog["taskSituation"],
  taskCriticality: "MEDIA" as CreateMachineLog["taskCriticality"],
  maintenanceType: "PREVENTIVA" as NonNullable<CreateMachineLog["maintenanceType"]>,
};

export default function MachineLogs({ machine }: { machine: Machine }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MachineLog[]>([]);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  async function loadLogs() {
    const page = await machineLogService.list();
    setLogs(page.content.filter((log) => log.machineId === machine.id));
  }

  useEffect(() => {
    machineLogService.list().then(
      (page) => setLogs(page.content.filter((log) => log.machineId === machine.id)),
      () => setLogs([]),
    );
  }, [machine.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await machineLogService.create({
        machineId: machine.id,
        placeId: machine.placeId,
        responsibleTeacherId: user?.id,
        ...form,
        title: form.title || undefined,
        plannedAction: form.plannedAction || undefined,
        description: form.description || undefined,
        servicePerformed: form.servicePerformed || undefined,
        executionReport: form.executionReport || undefined,
      });
      setForm(initialForm);
      setIsFormOpen(false);
      await loadLogs();
      toast.success("Log da máquina registrado.");
    } catch (requestError) {
      toast.error(getServiceErrorMessage(requestError, "Não foi possível registrar o log da máquina."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="ui-surface mt-6 space-y-5 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Log da máquina</h2>
          <p className="text-sm text-gray-500">Registre ações planejadas, execução e relatórios desta máquina.</p>
        </div>
        <Button icon={Plus} onClick={() => setIsFormOpen((current) => !current)}>{isFormOpen ? "Cancelar" : "Novo log"}</Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-200 pt-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Título" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <Input label="Ação planejada" value={form.plannedAction} onChange={(event) => setForm({ ...form, plannedAction: event.target.value })} />
            <div><label htmlFor="machine-log-situation" className="ui-field-label">Situação *</label><select id="machine-log-situation" className="ui-control mt-1.5" value={form.taskSituation} onChange={(event) => setForm({ ...form, taskSituation: event.target.value as CreateMachineLog["taskSituation"] })}><option value="PENDENTE">Pendente</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluída</option></select></div>
            <div><label htmlFor="machine-log-criticality" className="ui-field-label">Criticidade *</label><select id="machine-log-criticality" className="ui-control mt-1.5" value={form.taskCriticality} onChange={(event) => setForm({ ...form, taskCriticality: event.target.value as CreateMachineLog["taskCriticality"] })}><option value="BAIXA">Baixa</option><option value="MEDIA">Média</option><option value="ALTA">Alta</option></select></div>
            <div><label htmlFor="machine-log-type" className="ui-field-label">Tipo de manutenção</label><select id="machine-log-type" className="ui-control mt-1.5" value={form.maintenanceType} onChange={(event) => setForm({ ...form, maintenanceType: event.target.value as NonNullable<CreateMachineLog["maintenanceType"]> })}><option value="PREVENTIVA">Preventiva</option><option value="CORRETIVA">Corretiva</option><option value="PREDITIVA">Preditiva</option><option value="AUTONOMA">Autônoma</option></select></div>
            <Input label="Serviço executado" value={form.servicePerformed} onChange={(event) => setForm({ ...form, servicePerformed: event.target.value })} />
          </div>
          <TextArea label="Descrição" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <TextArea label="Relatório de execução" value={form.executionReport} onChange={(event) => setForm({ ...form, executionReport: event.target.value })} />
          <div className="flex justify-end"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar log"}</Button></div>
        </form>
      )}

      <div className="space-y-3 border-t border-gray-200 pt-5">
        {logs.length === 0 ? <p className="text-sm text-gray-500">Nenhum log registrado para esta máquina.</p> : logs.map((log) => (
          <article key={log.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex gap-3"><ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-weg-blue" /><div className="min-w-0"><p className="font-semibold text-gray-800">{log.title || log.plannedAction || "Registro de manutenção"}</p><p className="mt-1 text-sm text-gray-600">{log.description || log.servicePerformed || "Sem descrição."}</p><div className="mt-3 flex flex-wrap gap-2 text-xs font-medium"><span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">{log.taskSituation}</span><span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">{log.taskCriticality}</span>{log.registeredAt && <span className="text-gray-500">Registrado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(log.registeredAt))}</span>}</div></div></div>
          </article>
        ))}
      </div>
    </section>
  );
}