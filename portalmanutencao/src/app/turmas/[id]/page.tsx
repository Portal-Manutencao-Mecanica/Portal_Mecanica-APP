import Link from "next/link";

import Button from "@/components/atoms/Button";
import { StudentCard } from "@/components/molecules/StudentCard";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

const classGroup = {
  acronym: "ES01",
  professors: ["João Silva", "Maria Souza"],
  students: [
    {
      id: 1,
      registration: "2025001",
      name: "Carlos Henrique",
    },
    {
      id: 2,
      registration: "2025002",
      name: "Ana Paula",
    },
    {
      id: 3,
      registration: "2025003",
      name: "Pedro Lucas",
    },
  ],
};

export default function ClassGroupPage() {
  return (
    <LayoutDesktop>
      <div className="space-y-6 p-8 ">
        <Link href="/turmas">
          <Button>← Voltar</Button>
        </Link>

        <div className="mt-5">
          <h1 className="text-3xl font-bold">
            Turma {classGroup.acronym}
          </h1>

          <p className="text-gray-600">
            Professores: {classGroup.professors.join(", ")}
          </p>
        </div>

        <div className="space-y-4">
          {classGroup.students.map((student) => (
            <StudentCard
              key={student.id}
              registration={student.registration}
              name={student.name}
            />
          ))}
        </div>
      </div>
    </LayoutDesktop>
  );
}