"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import { useAuth } from "@/hooks/useAuth";
import type { Teacher } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";
import { teacherService } from "@/services/teacherService";

export default function MaintenceForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [form, setForm] = useState({
    sector: "AREA_NAO_DESIGNADA",
    priority: "MEDIA",
    placeId: "",
    machineId: "",
    notifiedTeacherId: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    teacherService.list().then(setTeachers).catch(() => setTeachers([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || user.role !== "ALUNO") return;
    setIsSubmitting(true);

    try {
      await maintenanceRequestService.create({
        sector: form.sector,
        priority: form.priority,
        assignedStudentIds: [user.id],
        placeId: form.placeId,
        machineId: form.machineId,
        description: form.description,
        notifiedTeacherId: form.notifiedTeacherId,
      });
      toast.success("Solicitação enviada ao professor.");
      router.push("/ocorrencias");
      router.refresh();
    } catch (requestError) {
      toast.error(getServiceErrorMessage(requestError, "Não foi possível enviar a solicitação."));
    } finally {
      setIsSubmitting(false);
    }
  }

  const isStudent = user?.role === "ALUNO";

  return (
    <form onSubmit={handleSubmit} className="ui-surface space-y-6 p-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
        <span className="block text-gray-500">Solicitante</span>
        <strong>{user?.name ?? "Carregando sessão..."}</strong>
        {isStudent && <p className="mt-1 text-gray-600">Sua identificação será vinculada automaticamente à solicitação.</p>}
      </div>
      {!isStudent && <p role="alert" className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">Somente alunos podem abrir solicitações de manutenção.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="ID do local *" required value={form.placeId} onChange={(event) => setForm({ ...form, placeId: event.target.value })} />
        <Input label="ID da máquina *" required value={form.machineId} onChange={(event) => setForm({ ...form, machineId: event.target.value })} />
        <div>
          <label htmlFor="notified-teacher" className="ui-field-label">Professor responsável *</label>
          <select id="notified-teacher" required className="ui-control mt-1.5" value={form.notifiedTeacherId} onChange={(event) => setForm({ ...form, notifiedTeacherId: event.target.value })}>
            <option value="">Selecione um professor</option>
            {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
          </select>
        </div>
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
        <Button type="submit" disabled={isSubmitting || !isStudent}>{isSubmitting ? "Enviando..." : "Enviar solicitação"}</Button>
      </div>
    </form>
  );
}