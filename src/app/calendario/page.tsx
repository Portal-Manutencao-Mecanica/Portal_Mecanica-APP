"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventInput } from "@fullcalendar/core";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Calendar from "@/components/organisms/Calendar";
import CalendarEventDetails from "@/components/organisms/CalendarEventDetails";
import CalendarEventForm, {
  type CalendarEventFormValues,
} from "@/components/organisms/CalendarEventForm";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import ModalDialog from "@/components/organisms/ModalDialog";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type { Equipment, Machine, Place, Student, Teacher } from "@/lib/api/types";
import { canManageCalendarEvents } from "@/lib/permissions";
import { calendarService } from "@/services/calendarService";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";
import { placeService } from "@/services/placeService";
import { studentService } from "@/services/studentService";
import { teacherService } from "@/services/teacherService";
import type {
  CalendarResponseDto,
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from "@/types/CalendarEvent";

type CalendarModal =
  | { type: "create"; scheduledFor: string }
  | { type: "details"; event: CalendarResponseDto }
  | { type: "edit"; event: CalendarResponseDto };

function toInputDate(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function nextAvailableDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 5, 0, 0);
  return toInputDate(date);
}

function scheduledTimeForDate(day: string) {
  const today = toInputDate(new Date()).slice(0, 10);
  return day === today ? nextAvailableDate() : `${day}T08:00`;
}

function sortEvents(events: CalendarResponseDto[]) {
  return [...events].sort((left, right) =>
    left.scheduledFor.localeCompare(right.scheduledFor),
  );
}

function toCalendarEvent(event: CalendarResponseDto): EventInput {
  return {
    id: event.id,
    title: event.scheduledAction,
    start: event.scheduledFor,
  };
}

export default function CalendarPage() {
  const { user } = useAuth();
  const canManage = canManageCalendarEvents(user?.role);
  const [events, setEvents] = useState<CalendarResponseDto[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [modal, setModal] = useState<CalendarModal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CalendarResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    let active = true;

    async function loadCalendar() {
      setLoading(true);
      try {
        const eventPagePromise = calendarService.list({
          size: 1000,
          sort: "scheduledFor,asc",
        });
        const referenceDataPromise = canManage
          ? Promise.all([
              equipmentService.list({ size: 1000, sort: "name,asc" }),
              machineService.list({ size: 1000, sort: "name,asc" }),
              placeService.list(),
              teacherService.list(),
              studentService.list({ size: 1000, sort: "name,asc" }),
            ])
          : Promise.resolve(null);

        const [eventPage, referenceData] = await Promise.all([
          eventPagePromise,
          referenceDataPromise,
        ]);
        if (!active) return;

        setEvents(sortEvents(eventPage.content));
        if (referenceData) {
          const [equipmentPage, machinePage, availablePlaces, availableTeachers, studentPage] =
            referenceData;
          setEquipment(equipmentPage.content);
          setMachines(machinePage.content);
          setPlaces(availablePlaces);
          setTeachers(availableTeachers);
          setStudents(studentPage.content);
        }
        setError("");
      } catch (loadError) {
        if (!active) return;
        setError(
          getServiceErrorMessage(loadError, "Não foi possível carregar o calendário."),
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCalendar();
    return () => {
      active = false;
    };
  }, [canManage]);

  function openCreate(scheduledFor: string) {
    if (!canManage) return;
    if (new Date(scheduledFor).getTime() < Date.now()) {
      toast.error("Não é possível agendar um evento em uma data passada.");
      return;
    }
    setModal({ type: "create", scheduledFor });
  }

  function openDetails(id: string) {
    const event = events.find((calendarEvent) => calendarEvent.id === id);
    if (event) setModal({ type: "details", event });
  }

  async function createEvent(values: CalendarEventFormValues) {
    const payload: CreateCalendarEventDto = {
      ...values,
      requestedAt: toInputDate(new Date()),
      studentId: values.studentId || undefined,
    };
    const created = await calendarService.create(payload);
    setEvents((current) => sortEvents([...current, created]));
    toast.success("Evento criado com sucesso.");
    closeModal();
  }

  async function updateEvent(
    original: CalendarResponseDto,
    values: CalendarEventFormValues,
  ) {
    const payload = toUpdatePayload(original, values);
    if (Object.keys(payload).length === 0) {
      toast.info("Nenhuma alteração foi realizada.");
      setModal({ type: "details", event: original });
      return;
    }

    const updated = await calendarService.update(original.id, payload);
    setEvents((current) => sortEvents(
      current.map((event) => event.id === updated.id ? updated : event),
    ));
    toast.success("Evento atualizado com sucesso.");
    setModal({ type: "details", event: updated });
  }

  async function deleteEvent() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await calendarService.remove(deleteTarget.id);
      setEvents((current) => current.filter((event) => event.id !== deleteTarget.id));
      setDeleteTarget(null);
      setModal(null);
      toast.success("Evento excluído com sucesso.");
    } catch (deleteError) {
      toast.error(getServiceErrorMessage(deleteError, "Não foi possível excluir o evento."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Calendário de manutenção"
          description={canManage
            ? "Visualize os eventos e clique em um dia para agendar uma manutenção."
            : "Visualize os eventos de manutenção programados."}
          actions={canManage ? (
            <Button
              type="button"
              icon={Plus}
              onClick={() => openCreate(nextAvailableDate())}
            >
              Novo evento
            </Button>
          ) : undefined}
        />

        {loading ? (
          <PageFeedback message="Carregando eventos..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-6">
            <Calendar
              events={events.map(toCalendarEvent)}
              onDateClick={canManage
                ? (info) => openCreate(scheduledTimeForDate(info.dateStr))
                : undefined}
              onEventClick={(info) => openDetails(info.event.id)}
            />
            {events.length === 0 && (
              <p role="status" className="text-center text-sm text-gray-500">
                Nenhum evento programado. {canManage ? "Clique em um dia para criar o primeiro." : ""}
              </p>
            )}
          </div>
        )}
      </section>

      {modal?.type === "create" && (
        <ModalDialog
          title="Agendar manutenção"
          description="Preencha os dados do novo evento."
          onClose={closeModal}
        >
          <CalendarEventForm
            key={modal.scheduledFor}
            mode="create"
            defaultScheduledFor={modal.scheduledFor}
            equipment={equipment}
            machines={machines}
            places={places}
            teachers={teachers}
            students={students}
            onCancel={closeModal}
            onSubmit={createEvent}
          />
        </ModalDialog>
      )}

      {modal?.type === "edit" && (
        <ModalDialog
          title="Editar evento"
          description="Atualize os dados da manutenção programada."
          onClose={closeModal}
        >
          <CalendarEventForm
            key={modal.event.id}
            mode="edit"
            initialValues={modal.event}
            equipment={equipment}
            machines={machines}
            places={places}
            teachers={teachers}
            students={students}
            onCancel={() => setModal({ type: "details", event: modal.event })}
            onSubmit={(values) => updateEvent(modal.event, values)}
          />
        </ModalDialog>
      )}

      {modal?.type === "details" && (
        <ModalDialog
          title={modal.event.scheduledAction}
          description="Detalhes da manutenção programada."
          onClose={closeModal}
        >
          <CalendarEventDetails
            event={modal.event}
            canManage={canManage}
            onClose={closeModal}
            onEdit={() => setModal({ type: "edit", event: modal.event })}
            onDelete={() => setDeleteTarget(modal.event)}
          />
        </ModalDialog>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Excluir evento"
        description="Esta ação não poderá ser desfeita. Deseja excluir o evento do calendário?"
        confirmText="Excluir"
        confirmVariant="danger"
        confirming={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void deleteEvent()}
      />
    </LayoutDesktop>
  );
}

function toUpdatePayload(
  original: CalendarResponseDto,
  values: CalendarEventFormValues,
): UpdateCalendarEventDto {
  const payload: UpdateCalendarEventDto = {};
  if (values.scheduledAction !== original.scheduledAction) {
    payload.scheduledAction = values.scheduledAction;
  }
  if (values.criticality !== original.criticality) payload.criticality = values.criticality;
  if (values.scheduledFor !== original.scheduledFor.slice(0, 16)) {
    payload.scheduledFor = values.scheduledFor;
  }
  if (values.maintenanceType !== original.maintenanceType) {
    payload.maintenanceType = values.maintenanceType;
  }
  if (values.equipmentId !== original.equipmentId) payload.equipmentId = values.equipmentId;
  if (values.machineId !== original.machineId) payload.machineId = values.machineId;
  if (values.placeId !== original.placeId) payload.placeId = values.placeId;
  if (values.teacherId !== original.teacherId) payload.teacherId = values.teacherId;
  if (values.studentId && values.studentId !== original.studentId) {
    payload.studentId = values.studentId;
  }
  if (values.status !== original.status) payload.status = values.status;
  return payload;
}
