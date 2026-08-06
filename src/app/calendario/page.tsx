"use client";

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Calendar from "@/components/organisms/Calendar";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
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
import { canCreateCalendarEvents } from "@/lib/permissions";

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
  const { user } = useAuth();
  const canCreateEvents = canCreateCalendarEvents(user?.role);
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
    if (!canCreateEvents) return;
    setForm(newForm(scheduledFor));
    setModal({ type: "create" });
  };

  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    async function loadCalendarData() {
      try {
        const [calendarItems, equipmentPage, machinePage, availablePlaces, availableTeachers, availableStudents] =
          await Promise.all([
            calendarService.list(),
            equipmentService.list({ size: 1000, sort: "name,asc" }),
            machineService.list({ size: 1000, sort: "name,asc" }),
            placeService.list(),
            teacherService.list(),
            studentService.list({ size: 1000, sort: "name,asc" }),
          ]);

        setEvents(calendarItems);
        setEquipment(equipmentPage.content);
        setMachines(machinePage.content);
        setPlaces(availablePlaces);
        setTeachers(availableTeachers);
        setStudents(availableStudents.content);
      } catch (error) {
        toast.error(getServiceErrorMessage(error, "Não foi possível carregar os dados do calendário."));
      } finally {
        setIsLoading(false);
      }
    }

    void loadCalendarData();
  }, []);

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canCreateEvents) {
      toast.error("Você só possui permissão para visualizar o calendário.");
      closeModal();
      return;
    }
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
      toast.success("Evento adicionado ao calendário.");
      closeModal();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível criar o evento."));
    } finally {
      setIsSaving(false);
    }
  }

  const referencesLoading = isLoading || isSaving;

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Calendário de manutenção"
          description={canCreateEvents
            ? "Visualize os eventos do mês e clique em um dia para agendar uma manutenção."
            : "Visualize os eventos de manutenção programados."}
          actions={canCreateEvents ? (
            <Button type="button" icon={Plus} onClick={() => openCreate(toInputDate(new Date()))}>
              Novo evento
            </Button>
          ) : undefined}
        />

        {isLoading ? (
          <PageFeedback message="Carregando eventos..." />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-6">
            <Calendar
              events={events.map(toCalendarEvent)}
              onDateClick={canCreateEvents ? (info) => openCreate(`${info.dateStr}T08:00`) : undefined}
              onEventClick={(info) => setModal({ type: "details", event: info.event.extendedProps as CalendarItem })}
            />
          </div>
        )}
      </section>

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelector),
    );
    focusableElements[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-bold text-gray-800">{title}</h2>
            <p id={descriptionId} className="text-sm text-gray-500">{description}</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            icon={X}
            iconOnly
            onClick={onClose}
            aria-label="Fechar"
            title="Fechar"
          />
        </div>
        {children}
      </div>
    </div>
  );
}

function formatScheduledDate(event: CalendarItem) {
  return new Date(`${event.day}T${event.hour}`).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" });
}
