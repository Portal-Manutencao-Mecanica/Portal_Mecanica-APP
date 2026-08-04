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
