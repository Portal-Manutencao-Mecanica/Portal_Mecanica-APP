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
    <div className="w-full">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locales={[ptBrLocale]}
        locale="pt-br"
        initialView="dayGridMonth"
        height={740}
        events={events}
        eventClick={onEventClick}
        dateClick={onDateClick}
        dayMaxEvents={3}
        buttonText={{ today: "Hoje" }}
      />
    </div>
  );
}
