import Link from "next/link";

import Button from "@/components/atoms/Button";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { StudentCard } from "@/components/molecules/StudentCard";

const classGroup = {
  id: 1,
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

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassGroupPage({ params }: Props) {
  const { id } = await params;

  return (
    <LayoutDesktop>
      <div className="max-w-6xl mx-auto p-8 space-y-6">

        <Link href="/turmas">
          <Button>← Voltar</Button>
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <h1 className="text-3xl font-bold">
            Turma {classGroup.acronym}
          </h1>

          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Professores:</span>{" "}
            {classGroup.professors.join(", ")}
          </p>
        </div>

        <div className="space-y-4">
          {classGroup.students.map((student) => (
            <StudentCard
              key={student.id}
              classGroupId={Number(id)}
              studentId={student.id}
              registration={student.registration}
              name={student.name}
            />
          ))}
        </div>

      </div>
    </LayoutDesktop>
  );
}