"use client";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar() {
  return (
    <div className="w-230  mx-auto">
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" height={740} />
    </div>
  );
}
