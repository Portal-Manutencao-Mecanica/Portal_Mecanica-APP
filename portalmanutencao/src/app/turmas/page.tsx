import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { DataRowCard } from "@/components/molecules/DataRowCard";

const classGroups = [
  {
    id: 1,
    acronym: "ES01",
    professors: ["João Silva", "Maria Souza"],
  },
  {
    id: 2,
    acronym: "ADS02",
    professors: ["Carlos Lima"],
  },
  {
    id: 3,
    acronym: "MEC01",
    professors: ["Pedro Santos", "Ana Costa"],
  },
];

export default function TurmasPage() {
  return (
    <LayoutDesktop>
      <div className="max-w-6xl mx-auto p-8 space-y-5">
        <h1 className="text-3xl font-bold">Turmas</h1>

        {classGroups.map((group) => (
          <>
          <DataRowCard children={undefined} actions={undefined}></DataRowCard>
          </>
        ))}
      </div>
    </LayoutDesktop>
  );
}