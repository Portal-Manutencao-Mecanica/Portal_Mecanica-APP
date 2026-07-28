"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { EventClickArg, EventInput } from "@fullcalendar/core";

interface CalendarProps {
  events: EventInput[];
  onEventClick?: (info: EventClickArg) => void;
}

export default function Calendar({
  events,
  onEventClick,
}: CalendarProps) {
  return (
    <div className="w-230 mx-auto">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height={740}
        events={events}
        eventClick={onEventClick}
      />
    </div>
  );
}