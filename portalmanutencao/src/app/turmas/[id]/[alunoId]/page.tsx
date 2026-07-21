import Link from "next/link";

import Button from "@/components/atoms/Button";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

const student = {
  id: 1,
  name: "Carlos Henrique",
  email: "carlos@weg.com",
  registration: "2025001",
  role: "Aluno",
  enabled: true,
  classGroups: [
    {
      id: 1,
      acronym: "ES01",
    },
    {
      id: 2,
      acronym: "ADS02",
    },
  ],
};

interface Props {
  params: Promise<{
    id: string;
    alunoId: string;
  }>;
}

export default async function StudentPage({ params }: Props) {
  const { id } = await params;

  return (
    <LayoutDesktop>
      <div className="max-w-6xl mx-auto p-8 space-y-6">

        <Link href={`/turmas/${id}`}>
          <Button>← Voltar</Button>
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8 mt-5">

          <h1 className="text-3xl font-bold mb-8">
            Perfil do Aluno
          </h1>

          <div className="grid grid-cols-2 gap-8">

            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="text-lg font-semibold">{student.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Matrícula</p>
              <p className="text-lg font-semibold">{student.registration}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">E-mail</p>
              <p className="text-lg font-semibold">{student.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Cargo</p>
              <p className="text-lg font-semibold">{student.role}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  student.enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {student.enabled ? "Ativo" : "Inativo"}
              </span>
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8">

          <h2 className="text-2xl font-semibold mb-5">
            Turmas
          </h2>

          <div className="flex flex-wrap gap-3">
            {student.classGroups.map((group) => (
              <span
                key={group.id}
                className="rounded-lg bg-[#00579D] px-4 py-2 text-white"
              >
                {group.acronym}
              </span>
            ))}
          </div>

        </div>

      </div>
    </LayoutDesktop>
  );
}