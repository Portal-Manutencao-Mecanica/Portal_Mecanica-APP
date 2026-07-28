"use client";

import { FormEvent, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import { Plus, X } from "lucide-react";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Calendar from "@/components/organisms/Calendar";
import { CalendarResponseDto, CreateCalendarEventDto } from "@/types/CalendarEvent";

type CalendarForm = Required<CreateCalendarEventDto>;
type Modal = { type: "create" } | { type: "details"; event: CalendarResponseDto };

const MOCK_CALENDAR_EVENTS: CalendarResponseDto[] = [
  { id: "event-1", numberCard: "CAL-001", scheduledAction: "Inspeção do torno CNC", criticality: "MEDIA", createdAt: "2026-07-28T08:00:00", scheduledFor: "2026-07-29T08:00:00", requestedAt: "2026-07-28T08:00:00", studentId: null, studentName: null, teacherId: "teacher-1", teacherName: "Arthur Mourão", equipmentId: "equipment-1", equipmentName: "Torno CNC Romi", machineId: "machine-1", machineName: "Torno 01", placeId: "place-1", placeName: "Laboratório de Usinagem", maintenanceType: "PREVENTIVA", status: "PENDENTE" },
  { id: "event-2", numberCard: "CAL-002", scheduledAction: "Troca de óleo", criticality: "ALTA", createdAt: "2026-07-28T09:00:00", scheduledFor: "2026-07-31T14:00:00", requestedAt: "2026-07-28T09:00:00", studentId: "student-1", studentName: "Ana Silva", teacherId: "teacher-1", teacherName: "Arthur Mourão", equipmentId: "equipment-2", equipmentName: "Fresadora", machineId: "machine-2", machineName: "Fresadora 02", placeId: "place-1", placeName: "Laboratório de Usinagem", maintenanceType: "PREVENTIVA", status: "AGENDADA" },
  { id: "event-3", numberCard: "CAL-003", scheduledAction: "Limpeza geral da bancada", criticality: "BAIXA", createdAt: "2026-07-28T10:00:00", scheduledFor: "2026-08-03T10:00:00", requestedAt: null, studentId: null, studentName: null, teacherId: null, teacherName: null, equipmentId: null, equipmentName: null, machineId: null, machineName: null, placeId: "place-2", placeName: "Laboratório de Metrologia", maintenanceType: "PREVENTIVA", status: "PENDENTE" },
];

const inputStyle = "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-weg-blue focus:ring-2 focus:ring-weg-blue/20";
const newForm = (scheduledFor: string): CalendarForm => ({ scheduledAction: "", criticality: "MEDIA", scheduledFor, maintenanceType: "PREVENTIVA", equipmentId: "", machineId: "", placeId: "", studentId: "", teacherId: "" });
const toInputDate = (value: string) => value.slice(0, 16);
const toCalendarEvent = (event: CalendarResponseDto): EventInput => ({ id: event.id, title: event.scheduledAction, start: event.scheduledFor, extendedProps: event });
const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "Não informado";

export default function CalendarioPage() {
  const [events, setEvents] = useState<CalendarResponseDto[]>(MOCK_CALENDAR_EVENTS);
  const [modal, setModal] = useState<Modal | null>(null);
  const [form, setForm] = useState<CalendarForm>(() => newForm(toInputDate(new Date().toISOString())));

  function openCreate(scheduledFor: string) {
    setForm(newForm(scheduledFor));
    setModal({ type: "create" });
  }

  function closeModal() {
    setModal(null);
  }

  function updateForm(field: keyof CalendarForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const createdEvent: CalendarResponseDto = {
      id: crypto.randomUUID(), numberCard: `CAL-${String(events.length + 1).padStart(3, "0")}`,
      scheduledAction: form.scheduledAction, criticality: form.criticality, scheduledFor: form.scheduledFor,
      maintenanceType: form.maintenanceType, createdAt: new Date().toISOString(), requestedAt: new Date().toISOString(),
      studentId: form.studentId || null, studentName: null, teacherId: form.teacherId || null, teacherName: null,
      equipmentId: form.equipmentId || null, equipmentName: null, machineId: form.machineId || null, machineName: null,
      placeId: form.placeId || null, placeName: null, status: "PENDENTE",
    };
    setEvents((current) => [...current, createdEvent]);
    closeModal();
  }

  return (
    <LayoutDesktop>
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-2xl font-bold text-gray-800">Calendário de manutenção</h1><p className="text-sm text-gray-500">Clique em um dia para agendar uma manutenção.</p></div>
          <button type="button" onClick={() => openCreate(toInputDate(new Date().toISOString()))} className="flex cursor-pointer items-center gap-2 self-start rounded-lg bg-weg-blue px-4 py-2 font-medium text-white shadow-sm hover:bg-[#00579D]/85 sm:self-auto"><Plus className="h-4 w-4" />Novo evento</button>
        </div>
        <Calendar events={events.map(toCalendarEvent)} onDateClick={(info) => openCreate(`${info.dateStr}T08:00`)} onEventClick={(info) => setModal({ type: "details", event: info.event.extendedProps as CalendarResponseDto })} />
      </main>
      {modal && <div role="dialog" aria-modal="true" aria-labelledby="calendar-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="calendar-modal-title" className="text-xl font-bold text-gray-800">{modal.type === "create" ? "Agendar manutenção" : "Detalhes do evento"}</h2>{modal.type === "create" && <p className="mt-1 text-sm text-gray-500">Os eventos são simulados localmente.</p>}</div><button type="button" aria-label="Fechar modal" onClick={closeModal} className="cursor-pointer rounded-md p-1 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
          {modal.type === "create" ? <form onSubmit={createEvent} className="space-y-4">
            <FormField id="scheduledAction" label="Ação programada *"><input id="scheduledAction" required value={form.scheduledAction} onChange={(event) => updateForm("scheduledAction", event.target.value)} placeholder="Ex.: Troca de óleo" className={inputStyle} /></FormField>
            <div className="grid gap-4 sm:grid-cols-2"><FormField id="scheduledFor" label="Data e hora *"><input id="scheduledFor" type="datetime-local" required value={form.scheduledFor} onChange={(event) => updateForm("scheduledFor", event.target.value)} className={inputStyle} /></FormField><FormField id="criticality" label="Criticidade *"><select id="criticality" value={form.criticality} onChange={(event) => updateForm("criticality", event.target.value)} className={inputStyle}><option value="BAIXA">Baixa</option><option value="MEDIA">Média</option><option value="ALTA">Alta</option><option value="CRITICA">Crítica</option></select></FormField></div>
            <FormField id="maintenanceType" label="Tipo de manutenção *"><select id="maintenanceType" value={form.maintenanceType} onChange={(event) => updateForm("maintenanceType", event.target.value)} className={inputStyle}><option value="PREVENTIVA">Preventiva</option><option value="CORRETIVA">Corretiva</option><option value="PREDITIVA">Preditiva</option></select></FormField>
            <div className="grid gap-4 sm:grid-cols-2"><TextField id="equipmentId" label="ID do equipamento" value={form.equipmentId} onChange={(value) => updateForm("equipmentId", value)} /><TextField id="machineId" label="ID da máquina" value={form.machineId} onChange={(value) => updateForm("machineId", value)} /><TextField id="placeId" label="ID do local" value={form.placeId} onChange={(value) => updateForm("placeId", value)} /><TextField id="studentId" label="ID do aluno responsável" value={form.studentId} onChange={(value) => updateForm("studentId", value)} /><TextField id="teacherId" label="ID do professor responsável" value={form.teacherId} onChange={(value) => updateForm("teacherId", value)} /></div>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5"><button type="button" onClick={closeModal} className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200">Cancelar</button><button type="submit" className="cursor-pointer rounded-lg bg-weg-blue px-4 py-2 font-medium text-white hover:bg-[#00579D]/85">Criar evento</button></div>
          </form> : <EventDetails event={modal.event} onClose={closeModal} />}
        </div>
      </div>}
    </LayoutDesktop>
  );
}

function FormField({ id, label, children }: { id: string; label: string; children: React.ReactNode }) { return <div><label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>{children}</div>; }
function TextField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) { return <FormField id={id} label={label}><input id={id} value={value} onChange={(event) => onChange(event.target.value)} className={inputStyle} /></FormField>; }
function Detail({ label, value }: { label: string; value: string | null }) { return <div className="rounded-lg bg-gray-50 p-3"><span className="block text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span><span className="mt-1 block font-medium text-gray-800">{value || "Não informado"}</span></div>; }
function EventDetails({ event, onClose }: { event: CalendarResponseDto; onClose: () => void }) { return <div className="space-y-4 text-sm"><p className="text-lg font-semibold text-gray-800">{event.scheduledAction}</p><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Detail label="Data programada" value={formatDate(event.scheduledFor)} /><Detail label="Criticidade" value={event.criticality} /><Detail label="Tipo" value={event.maintenanceType} /><Detail label="Status" value={event.status} /><Detail label="Equipamento" value={event.equipmentName} /><Detail label="Máquina" value={event.machineName} /><Detail label="Local" value={event.placeName} /><Detail label="Aluno responsável" value={event.studentName} /><Detail label="Professor" value={event.teacherName} /><Detail label="Cartão" value={event.numberCard} /></div><div className="flex justify-end border-t border-gray-100 pt-5"><button type="button" onClick={onClose} className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200">Fechar</button></div></div>; }
