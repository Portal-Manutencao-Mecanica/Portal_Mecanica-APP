"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import { useAuth } from "@/hooks/useAuth";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";

export default function MaintenceForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    sector: "AREA_NAO_DESIGNADA",
    priority: "MEDIA",
    assignedStudentIds: "",
    placeId: "",
    machineId: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await maintenanceRequestService.create({
        sector: form.sector,
        priority: form.priority,
        assignedStudentIds: form.assignedStudentIds.split(",").map((id) => id.trim()).filter(Boolean),
        placeId: form.placeId,
        machineId: form.machineId,
        description: form.description,
        notifiedTeacherId: user.id,
      });
      router.push("/ocorrencias");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ui-surface space-y-6 p-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
        <span className="block text-gray-500">Solicitante</span>
        <strong>{user?.name ?? "Carregando sessão..."}</strong>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="ID do local *" required value={form.placeId} onChange={(event) => setForm({ ...form, placeId: event.target.value })} />
        <Input label="ID da máquina *" required value={form.machineId} onChange={(event) => setForm({ ...form, machineId: event.target.value })} />
        <Input label="IDs dos alunos *" required placeholder="Separe UUIDs por vírgula" value={form.assignedStudentIds} onChange={(event) => setForm({ ...form, assignedStudentIds: event.target.value })} />
        <div>
          <label htmlFor="sector" className="ui-field-label">Setor *</label>
          <select id="sector" className="ui-control mt-1.5" value={form.sector} onChange={(event) => setForm({ ...form, sector: event.target.value })}>
            <option value="AREA_NAO_DESIGNADA">Área não designada</option>
            <option value="CENTRO_WEG">Centro WEG</option>
            <option value="WEG_MANUTENCAO">WEG Manutenção</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="ui-field-label">Prioridade *</label>
          <select id="priority" className="ui-control mt-1.5" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>
      </div>
      <TextArea label="Descrição *" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !user}>{isSubmitting ? "Enviando..." : "Enviar ocorrência"}</Button>
      </div>
    </form>
  );
}
