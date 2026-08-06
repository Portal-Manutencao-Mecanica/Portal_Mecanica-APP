"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { EventClickArg, EventInput } from "@fullcalendar/core";

interface CalendarProps {
  events: EventInput[];
  onEventClick?: (info: EventClickArg) => void;
  onDateClick?: (info: DateClickArg) => void;
}

export default function Calendar({ events, onEventClick, onDateClick }: CalendarProps) {
  return (
    <div className="calendar-shell w-full overflow-x-auto">
      {/* Estilização moderna do FullCalendar */}
      <style jsx global>{`
        /* --- CABEÇALHO E NAVEGAÇÃO --- */
        .calendar-shell .fc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem !important;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .calendar-shell .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #1f2937 !important;
          text-transform: capitalize;
        }

        /* Desagrupa e separa os botões de seta e 'Hoje' */
        .calendar-shell .fc-button-group {
          display: inline-flex !important;
          gap: 0.5rem !important;
        }

        .calendar-shell .fc-button-group > .fc-button,
        .calendar-shell .fc-today-button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 0.5rem !important; /* Cantos arredondados individuais */
          background-color: #f3f4f6 !important;
          border: 1px solid #e5e7eb !important;
          color: #374151 !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          padding: 0.5rem 0.875rem !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          transition: all 0.2s ease-in-out !important;
          cursor: pointer !important;
          text-transform: capitalize !important;
        }

        .calendar-shell .fc-button-group > .fc-button:hover,
        .calendar-shell .fc-today-button:hover {
          background-color: #e5e7eb !important;
          color: #111827 !important;
          border-color: #d1d5db !important;
        }

        .calendar-shell .fc-button-group > .fc-button:focus,
        .calendar-shell .fc-today-button:focus {
          box-shadow: 0 0 0 2px #3b82f6 !important;
        }

        .calendar-shell .fc-button-group > .fc-button:disabled,
        .calendar-shell .fc-today-button:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

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
        plugins={[dayGridPlugin, interactionPlugin]}
        locales={[ptBrLocale]}
        locale="pt-br"
        initialView="dayGridMonth"
        height="auto"
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
        dayMaxEvents={2}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        buttonText={{ today: "Hoje" }}
      />
    </div>
  );
}