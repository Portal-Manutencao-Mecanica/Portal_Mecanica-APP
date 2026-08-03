"use client";

import { FormEvent, useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import Calendar from "@/components/organisms/Calendar";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type {
  Equipment,
  Machine,
  Place,
  Student,
  TaskSituation,
  Teacher,
} from "@/lib/api/types";
import { calendarService } from "@/services/calendarService";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";
import { placeService } from "@/services/placeService";
import { studentService } from "@/services/studentService";
import { teacherService } from "@/services/teacherService";
import type { CalendarItem, CreateCalendarEventDto } from "@/types/CalendarEvent";

type CalendarForm = Omit<CreateCalendarEventDto, "studentId" | "status"> & {
  studentId: string;
  status: TaskSituation;
};

type Modal =
  | { type: "create" }
  | { type: "details"; event: CalendarItem };

const calendarFormSchema = v.object({
  scheduledAction: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe a acao programada.")),
  criticality: v.picklist(["BAIXA", "MEDIA", "ALTA"]),
  scheduledFor: v.pipe(v.string(), v.nonEmpty("Informe a data e a hora.")),
  requestedAt: v.pipe(v.string(), v.nonEmpty("Informe a data da solicitacao.")),
  maintenanceType: v.picklist(["PREVENTIVA", "CORRETIVA", "PREDITIVA", "AUTONOMA"]),
  equipmentId: v.pipe(v.string(), v.uuid("Selecione um equipamento valido.")),
  machineId: v.pipe(v.string(), v.uuid("Selecione uma maquina valida.")),
  placeId: v.pipe(v.string(), v.uuid("Selecione um local valido.")),
  studentId: v.optional(v.string()),
  teacherId: v.pipe(v.string(), v.uuid("Selecione um professor valido.")),
  status: v.picklist(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"]),
});

function toInputDate(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function newForm(scheduledFor: string): CalendarForm {
  return {
    scheduledAction: "",
    criticality: "MEDIA",
    scheduledFor,
    requestedAt: toInputDate(new Date()),
    maintenanceType: "PREVENTIVA",
    equipmentId: "",
    machineId: "",
    placeId: "",
    studentId: "",
    teacherId: "",
    status: "PENDENTE",
  };
}

function toCalendarEvent(event: CalendarItem): EventInput {
  return {
    title: event.title,
    start: `${event.day}T${event.hour}`,
    extendedProps: event,
  };
}

function toCalendarItem(event: Pick<CreateCalendarEventDto, "scheduledAction" | "scheduledFor">): CalendarItem {
  const [day, hour] = event.scheduledFor.split("T");
  return { day, hour: hour ?? "00:00", title: event.scheduledAction };
}

function sortEvents(events: CalendarItem[]) {
  return [...events].sort((left, right) =>
    `${left.day}T${left.hour}`.localeCompare(`${right.day}T${right.hour}`),
  );
}

export default function CalendarioPage() {
  const [events, setEvents] = useState<CalendarItem[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [modal, setModal] = useState<Modal | null>(null);
  const [form, setForm] = useState<CalendarForm>(() => newForm(toInputDate(new Date())));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const updateForm = (field: keyof CalendarForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreate = (scheduledFor: string) => {
    setForm(newForm(scheduledFor));
    setModal({ type: "create" });
  };

  const closeModal = () => setModal(null);

  useEffect(() => {
    async function loadCalendarData() {
      try {
        const [calendarItems, equipmentPage, machinePage, availablePlaces, availableTeachers, availableStudents] =
          await Promise.all([
            calendarService.list(),
            equipmentService.list(),
            machineService.list(),
            placeService.list(),
            teacherService.list(),
            studentService.list(),
          ]);

        setEvents(calendarItems);
        setEquipment(equipmentPage.content);
        setMachines(machinePage.content);
        setPlaces(availablePlaces);
        setTeachers(availableTeachers);
        setStudents(availableStudents);
      } catch (error) {
        toast.error(getServiceErrorMessage(error, "Nao foi possivel carregar os dados do calendario."));
      } finally {
        setIsLoading(false);
      }
    }

    void loadCalendarData();
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
      const payload: CreateCalendarEventDto = {
        ...validation.output,
        studentId: validation.output.studentId?.trim() || undefined,
      };
      const createdEvent = await calendarService.create(payload);

      setEvents((current) => sortEvents([...current, toCalendarItem(createdEvent)]));
      toast.success("Evento adicionado ao calendario.");
      closeModal();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Nao foi possivel criar o evento."));
    } finally {
      setIsSaving(false);
    }
  }

  const referencesLoading = isLoading || isSaving;

  return (
    <LayoutDesktop>
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Calendario de manutencao preventiva</h1>
            <p className="text-sm text-gray-500">Clique em um dia para agendar uma manutencao.</p>
          </div>
          <Button type="button" icon={Plus} onClick={() => openCreate(toInputDate(new Date()))}>
            Novo evento
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Carregando eventos...</p>
        ) : (
          <Calendar
            events={events.map(toCalendarEvent)}
            onDateClick={(info) => openCreate(`${info.dateStr}T08:00`)}
            onEventClick={(info) => setModal({ type: "details", event: info.event.extendedProps as CalendarItem })}
          />
        )}
      </main>

      {modal?.type === "create" && (
        <ModalShell title="Agendar manutencao" description="Preencha os dados do evento." onClose={closeModal}>
          <form onSubmit={createEvent} className="space-y-4">
            <Input id="scheduledAction" label="Acao programada *" value={form.scheduledAction} onChange={(event) => updateForm("scheduledAction", event.target.value)} required />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="scheduledFor" label="Data e hora *" type="datetime-local" value={form.scheduledFor} onChange={(event) => updateForm("scheduledFor", event.target.value)} required />
              <DropDown id="criticality" label="Criticidade *" defaultSelection="Selecione a criticidade" enumData={{ BAIXA: "Baixa", MEDIA: "Media", ALTA: "Alta" }} value={form.criticality} onSelect={(value) => updateForm("criticality", value)} />
            </div>

            <DropDown id="maintenanceType" label="Tipo de manutencao *" defaultSelection="Selecione o tipo" enumData={{ PREVENTIVA: "Preventiva", CORRETIVA: "Corretiva", PREDITIVA: "Preditiva", AUTONOMA: "Autonoma" }} value={form.maintenanceType} onSelect={(value) => updateForm("maintenanceType", value)} />

            <div className="grid gap-4 sm:grid-cols-2">
              <DropDown id="equipmentId" label="Equipamento *" defaultSelection={referencesLoading ? "Carregando opcoes..." : "Selecione um equipamento"} enumData={Object.fromEntries(equipment.map((item) => [item.id, item.name]))} value={form.equipmentId} onSelect={(value) => updateForm("equipmentId", value)} disabled={referencesLoading} />
              <DropDown id="machineId" label="Maquina *" defaultSelection={referencesLoading ? "Carregando opcoes..." : "Selecione uma maquina"} enumData={Object.fromEntries(machines.map((item) => [item.id, item.name]))} value={form.machineId} onSelect={(value) => updateForm("machineId", value)} disabled={referencesLoading} />
              <DropDown id="placeId" label="Local *" defaultSelection={referencesLoading ? "Carregando opcoes..." : "Selecione um local"} enumData={Object.fromEntries(places.map((item) => [item.id, item.name]))} value={form.placeId} onSelect={(value) => updateForm("placeId", value)} disabled={referencesLoading} />
              <DropDown id="teacherId" label="Professor responsavel *" defaultSelection={referencesLoading ? "Carregando opcoes..." : "Selecione um professor"} enumData={Object.fromEntries(teachers.map((item) => [item.id, item.name]))} value={form.teacherId} onSelect={(value) => updateForm("teacherId", value)} disabled={referencesLoading} />
              <DropDown id="studentId" label="Aluno responsavel" defaultSelection={referencesLoading ? "Carregando opcoes..." : "Nenhum aluno selecionado"} enumData={Object.fromEntries(students.map((item) => [item.id, item.name]))} value={form.studentId} onSelect={(value) => updateForm("studentId", value)} disabled={referencesLoading} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
              <Button type="submit" disabled={isSaving || isLoading}>{isSaving ? "Criando..." : "Criar evento"}</Button>
            </div>
          </form>
        </ModalShell>
      )}

      {modal?.type === "details" && (
        <ModalShell title={modal.event.title} description="Manutencao programada" onClose={closeModal}>
          <p className="text-sm text-gray-700">{formatScheduledDate(modal.event)}</p>
          <div className="mt-6 flex justify-end"><Button type="button" variant="secondary" onClick={closeModal}>Fechar</Button></div>
        </ModalShell>
      )}
    </LayoutDesktop>
  );
}

function ModalShell({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: React.ReactNode }) {
  return <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"><div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-gray-800">{title}</h2><p className="text-sm text-gray-500">{description}</p></div><button type="button" onClick={onClose} aria-label="Fechar"><X className="h-5 w-5" /></button></div>{children}</div></div>;
}

function formatScheduledDate(event: CalendarItem) {
  return new Date(`${event.day}T${event.hour}`).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" });
}
