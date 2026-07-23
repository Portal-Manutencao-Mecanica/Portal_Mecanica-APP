import Link from "next/link";

import Button from "@/components/atoms/Button";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { StudentTable } from "@/components/organisms/StudentTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

const students = [
  {
    id: 1,
    name: "Carlos Henrique",
    email: "carlos@weg.com",
    numberCard: "123456",
    enabled: true,
    classGroups: ["ES01", "ADS02"],
  },
  {
    id: 2,
    name: "Ana Paula",
    email: "ana@weg.com",
    numberCard: "456789",
    enabled: true,
    classGroups: ["ES01"],
  },
  {
    id: 3,
    name: "Pedro Lucas",
    email: "pedro@weg.com",
    numberCard: "987654",
    enabled: false,
    classGroups: ["ADS02"],
  },
];

export default function StudentsPage() {
  return (
    <LayoutDesktop>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        <Breadcrumbs />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Alunos
            </h1>

            <p className="text-gray-500">
              Visualize todos os alunos cadastrados.
            </p>
          </div>

          <Link href="/alunos/criar">
            <Button>
              Novo Aluno
            </Button>
          </Link>

        </div>

        <StudentTable students={students} />

      </div>
    </LayoutDesktop>
  );
}