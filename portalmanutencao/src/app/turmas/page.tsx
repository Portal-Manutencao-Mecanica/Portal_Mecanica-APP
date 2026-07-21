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
    acronym: "ES02",
    professors: ["Carlos Lima"],
  },
  {
    id: 3,
    acronym: "ADS03",
    professors: ["Pedro Santos", "Ana Costa"],
  },
];

export default function Home() {
  return (
    <LayoutDesktop>
      <div className="flex flex-col gap-4 p-8">
        {classGroups.map((group) => (
          <DataRowCard
            key={group.id}
            acronym={group.acronym}
            professors={group.professors}
            classGroupId={group.id}
          />
        ))}
      </div>
    </LayoutDesktop>
  );
}
