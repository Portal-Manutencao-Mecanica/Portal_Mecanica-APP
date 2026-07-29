import Link from "next/link";

import Button from "@/components/atoms/Button";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { StudentCard } from "@/components/molecules/StudentCard";
import { classGroupService } from "@/services/classGroupService";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClassGroupPage({ params }: Props) {
  const { id } = await params;
  const classGroup = await classGroupService.getById(id).catch(() => null);

  if (!classGroup) {
    return (
      <LayoutDesktop>
        <div className="p-8 space-y-4">
          <h1 className="text-2xl font-bold">Não foi possível carregar a turma.</h1>
          <Link href="/turmas">
            <Button>Voltar para turmas</Button>
          </Link>
        </div>
      </LayoutDesktop>
    );
  }

  return (
    <LayoutDesktop>
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <Link href="/turmas"><Button>← Voltar</Button></Link>

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
}
