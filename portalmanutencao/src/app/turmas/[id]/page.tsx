import Link from "next/link";

import Button from "@/components/atoms/Button";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { StudentCard } from "@/components/molecules/StudentCard";

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

interface ClassGroupProps {
  id: number;
  acronym: string;
  teachers: Teacher[];
  students: Student[];
}

interface Props {
  params: Promise<{
    id: number;
  }>;
}

export default async function ClassGroupPage({ params }: Props) {
  const { id } = await params;

  try {
    const response = await fetch(`http://localhost:8080/api/turma/${id}`);

    if (!response.ok) {
      throw new Error(`Falha ao buscar a turma: ${response.status}`);
    }

    const classGroup: ClassGroupProps = await response.json();

    return (
      <LayoutDesktop>
        <div className="max-w-6xl mx-auto p-8 space-y-6">
          <Link href="/turmas">
            <Button>← Voltar</Button>
          </Link>

          <div className="rounded-xl border border-gray-200 border-t-8 border-t-weg-blue bg-white shadow-sm p-6 mt-5 mb-10">
            <h1 className="text-3xl font-bold">Turma {classGroup.acronym}</h1>
            <p className="mt-2 text-gray-600">
              <span className="font-semibold">Professores:</span>{" "}
              {classGroup.teachers.map((teacher) => teacher.name).join(", ")}
            </p>
          </div>

          <div className="space-y-4">
            {classGroup.students.map((student) => (
              <StudentCard
                key={student.id}
                classGroupId={id}
                studentId={student.id}
                name={student.name}
              />
            ))}
          </div>
        </div>
      </LayoutDesktop>
    );
  } catch (error) {
    console.error("Erro ao carregar a turma:", error);
    return null;
  }
}
