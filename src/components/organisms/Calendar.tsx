"use client";

import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { EventClickArg, EventInput } from "@fullcalendar/core";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "@/components/atoms/Button";

interface CalendarProps {
  events: EventInput[];
  onEventClick?: (info: EventClickArg) => void;
  onDateClick?: (info: DateClickArg) => void;
}

export default function Calendar({ events, onEventClick, onDateClick }: CalendarProps) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [currentTitle, setCurrentTitle] = useState("");

  const updateTitle = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setCurrentTitle(calendarApi.view.title);
    }
  };

  useEffect(() => {
    updateTitle();
  }, []);

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
    updateTitle();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
    updateTitle();
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
    updateTitle();
  };

  return (
    <div className="calendar-shell w-full overflow-x-auto">
      {/* CABEÇALHO UTILIZANDO OS ATOMS AZUIS DA SUA APLICAÇÃO */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            icon={ChevronLeft}
            iconOnly
            onClick={handlePrev}
            aria-label="Mês anterior"
            title="Mês anterior"
          />
          <Button
            type="button"
            icon={ChevronRight}
            iconOnly
            onClick={handleNext}
            aria-label="Próximo mês"
            title="Próximo mês"
          />
          <Button
            type="button"
            onClick={handleToday}
          >
            Hoje
          </Button>
        </div>

        <h2 className="text-xl font-bold capitalize text-gray-800">
          {currentTitle}
        </h2>
      </div>

      {/* ESTILIZAÇÃO DA GRADE E DOS CARDS DE EVENTO */}
      <style jsx global>{`
        /* --- GRADE E DIAS DA SEMANA --- */
        .calendar-shell .fc-theme-standard td,
        .calendar-shell .fc-theme-standard th {
          border-color: #f3f4f6 !important;
        }

        .calendar-shell .fc-col-header-cell {
          padding: 0.75rem 0 !important;
          background-color: #f9fafb !important;
        }

        .calendar-shell .fc-col-header-cell-cushion {
          color: #4b5563 !important;
          font-weight: 600 !important;
          font-size: 0.8125rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          text-decoration: none !important;
        }

        .calendar-shell .fc-daygrid-day {
          transition: background-color 0.15s ease !important;
        }

        .calendar-shell .fc-daygrid-day:hover {
          background-color: #f9fafb !important;
        }

        /* Dia atual destacado */
        .calendar-shell .fc-day-today {
          background-color: #eff6ff !important;
        }

        .calendar-shell .fc-daygrid-day-number {
          color: #374151 !important;
          font-size: 0.875rem !important;
          font-weight: 600 !important;
          padding: 0.5rem 0.625rem !important;
          text-decoration: none !important;
        }

        /* --- CARDS DE EVENTOS --- */
        .calendar-shell .fc-daygrid-event {
          border-radius: 0.375rem !important;
          padding: 0.25rem 0.5rem !important;
          margin-top: 0.25rem !important;
          font-size: 0.75rem !important;
          font-weight: 500 !important;
          background-color: #e0f2fe !important;
          border: 1px solid #bae6fd !important;
          color: #0369a1 !important;
          transition: transform 0.15s ease, box-shadow 0.15s ease !important;
        }

        .calendar-shell .fc-daygrid-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05) !important;
          background-color: #bae6fd !important;
        }

        .calendar-shell .fc-daygrid-event-dot {
          border-color: #0284c7 !important;
        }

        /* Botão '+ mais X eventos' */
        .calendar-shell .fc-daygrid-more-link {
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          color: #2563eb !important;
          text-decoration: none !important;
          padding: 2px 4px !important;
        }

        .calendar-shell .fc-daygrid-more-link:hover {
          text-decoration: underline !important;
        }
      `}</style>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        locales={[ptBrLocale]}
        locale="pt-br"
        initialView="dayGridMonth"
        height="auto"
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
        dayMaxEvents={2}
        headerToolbar={false}
      />
    </div>
  );
}