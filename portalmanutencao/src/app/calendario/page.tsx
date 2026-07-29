"use client";

import { FormEvent, useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Calendar from "@/components/organisms/Calendar";
import { CalendarResponseDto, CreateCalendarEventDto } from "@/types/CalendarEvent";
import { calendarService } from "@/services/calendarService";
import { getServiceErrorMessage } from "@/services/httpService";

type CalendarForm = Required<CreateCalendarEventDto>;
type Modal = { type: "create" } | { type: "details"; event: CalendarResponseDto };

const calendarFormSchema = v.object({
  scheduledAction: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe a acao programada.")),
  criticality: v.pipe(v.string(), v.nonEmpty("Selecione a criticidade.")),
  scheduledFor: v.pipe(v.string(), v.nonEmpty("Informe a data e a hora.")),
  requestedAt: v.pipe(v.string(), v.nonEmpty("Informe a data da solicitacao.")),
  maintenanceType: v.pipe(v.string(), v.nonEmpty("Selecione o tipo de manutencao.")),
  equipmentId: v.pipe(v.string(), v.trim(), v.uuid("Informe um identificador de equipamento valido.")),
  machineId: v.pipe(v.string(), v.trim(), v.uuid("Informe um identificador de maquina valido.")),
  placeId: v.pipe(v.string(), v.trim(), v.uuid("Informe um identificador de local valido.")),
  studentId: v.optional(v.string()),
  teacherId: v.pipe(v.string(), v.trim(), v.uuid("Informe um identificador de professor valido.")),
  status: v.pipe(v.string(), v.nonEmpty("Informe a situacao da tarefa.")),
});

const initialEvents: CalendarResponseDto[] = [];
const inputStyle = "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-weg-blue focus:ring-2 focus:ring-weg-blue/20";
const toInputDate = (value: string) => value.slice(0, 16);
const newForm = (scheduledFor: string): CalendarForm => ({
  scheduledAction: "",
  criticality: "MEDIA",
  scheduledFor,
  requestedAt: toInputDate(new Date().toISOString()),
  maintenanceType: "PREVENTIVA",
  equipmentId: "",
  machineId: "",
  placeId: "",
  studentId: "",
  teacherId: "",
  status: "PENDENTE",
});
const toCalendarEvent = (event: CalendarResponseDto): EventInput => ({ id: event.id, title: event.scheduledAction, start: event.scheduledFor, extendedProps: event });

export default function CalendarioPage() {
  const [events, setEvents] = useState<CalendarResponseDto[]>(initialEvents);
  const [modal, setModal] = useState<Modal | null>(null);
  const [form, setForm] = useState<CalendarForm>(() => newForm(toInputDate(new Date().toISOString())));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const updateForm = (field: keyof CalendarForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const openCreate = (scheduledFor: string) => { setForm(newForm(scheduledFor)); setModal({ type: "create" }); };
  const closeModal = () => setModal(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const page = await calendarService.list();
        setEvents(page.content);
      } catch (error) {
        toast.error(getServiceErrorMessage(error, "Nao foi possivel carregar o calendario."));
      } finally {
        setIsLoading(false);
      }
    }

    void loadEvents();
  }, []);

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = v.safeParse(calendarFormSchema, form);

    if (!validation.success) {
      toast.error(validation.issues[0]?.message ?? "Revise os dados do evento.");
      return;
    }

    setIsSaving(true);
    try {
      const createdEvent = await calendarService.create({
        ...validation.output,
        studentId: validation.output.studentId?.trim() || undefined,
      });
      setEvents((current) => [...current, createdEvent]);
      toast.success("Evento adicionado ao calendario.");
      closeModal();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Nao foi possivel criar o evento."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <LayoutDesktop>
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Calendario de manutencao</h1>
            <p className="text-sm text-gray-500">Clique em um dia para agendar uma manutencao.</p>
          </div>
          <button type="button" onClick={() => openCreate(toInputDate(new Date().toISOString()))} className="flex items-center gap-2 rounded-lg bg-weg-blue px-4 py-2 font-medium text-white">
            <Plus className="h-4 w-4" />Novo evento
          </button>
        </div>
        {isLoading ? <p className="text-sm text-gray-500">Carregando eventos...</p> : <Calendar events={events.map(toCalendarEvent)} onDateClick={(info) => openCreate(`${info.dateStr}T08:00`)} onEventClick={(info) => setModal({ type: "details", event: info.event.extendedProps as CalendarResponseDto })} />}
      </main>
      {modal?.type === "create" && <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-xl bg-white p-6"><div className="mb-6 flex justify-between"><div><h2 className="text-xl font-bold">Agendar manutencao</h2><p className="text-sm text-gray-500">Preencha os dados do evento.</p></div><button onClick={closeModal} aria-label="Fechar"><X /></button></div><form onSubmit={createEvent} className="space-y-4"><FormField id="scheduledAction" label="Acao programada *"><input id="scheduledAction" value={form.scheduledAction} onChange={(event) => updateForm("scheduledAction", event.target.value)} className={inputStyle} /></FormField><div className="grid gap-4 sm:grid-cols-2"><FormField id="scheduledFor" label="Data e hora *"><input id="scheduledFor" type="datetime-local" value={form.scheduledFor} onChange={(event) => updateForm("scheduledFor", event.target.value)} className={inputStyle} /></FormField><FormField id="criticality" label="Criticidade *"><select id="criticality" value={form.criticality} onChange={(event) => updateForm("criticality", event.target.value)} className={inputStyle}><option value="BAIXA">Baixa</option><option value="MEDIA">Media</option><option value="ALTA">Alta</option></select></FormField></div><FormField id="maintenanceType" label="Tipo de manutencao *"><select id="maintenanceType" value={form.maintenanceType} onChange={(event) => updateForm("maintenanceType", event.target.value)} className={inputStyle}><option value="PREVENTIVA">Preventiva</option><option value="CORRETIVA">Corretiva</option><option value="PREDITIVA">Preditiva</option></select></FormField><div className="grid gap-4 sm:grid-cols-2"><TextField id="equipmentId" label="Identificador do equipamento *" value={form.equipmentId} onChange={(value) => updateForm("equipmentId", value)} /><TextField id="machineId" label="Identificador da maquina *" value={form.machineId} onChange={(value) => updateForm("machineId", value)} /><TextField id="placeId" label="Identificador do local *" value={form.placeId} onChange={(value) => updateForm("placeId", value)} /><TextField id="studentId" label="Identificador do aluno responsavel" value={form.studentId} onChange={(value) => updateForm("studentId", value)} /><TextField id="teacherId" label="Identificador do professor responsavel *" value={form.teacherId} onChange={(value) => updateForm("teacherId", value)} /></div><div className="flex justify-end gap-3"><button type="button" onClick={closeModal}>Cancelar</button><button type="submit" disabled={isSaving}>{isSaving ? "Criando..." : "Criar evento"}</button></div></form></div></div>}
    </LayoutDesktop>
  );
}

function FormField({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>{children}</div>;
}

function TextField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <FormField id={id} label={label}><input id={id} value={value} onChange={(event) => onChange(event.target.value)} className={inputStyle} /></FormField>;
}