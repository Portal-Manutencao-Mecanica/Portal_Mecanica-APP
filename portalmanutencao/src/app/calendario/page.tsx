"use client"
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Calendar from "@/components/organisms/Calendar";

const events = [
  {
    id: "1",
    title: "Troca de óleo",
    start: "2026-07-28T08:00:00",
  },
  {
    id: "2",
    title: "Inspeção",
    start: "2026-07-30T14:00:00",
  },
  {
    id: "3",
    title: "Limpeza",
    start: "2026-08-02",
  },
];

export default function CalendarioPage() {
  return (
    <LayoutDesktop>
      <Calendar
        events={events}
        onEventClick={(info) => {
          console.log(info.event);
        }}
      />
    </LayoutDesktop>
  );
}