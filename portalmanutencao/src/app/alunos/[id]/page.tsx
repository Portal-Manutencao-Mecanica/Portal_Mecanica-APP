import Link from "next/link";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

const student = {
  id: 1,
  name: "Carlos Henrique",
  email: "carlos@weg.com",
  numberCard: "123456",
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
    {
      id: 3,
      acronym: "MEC01",
    },
  ],
};

export default function StudentPage() {
  return (
    <LayoutDesktop>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">

        <div className="rounded-xl border border-gray-200 border-t-8 border-t-weg-blue bg-white shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold">Perfil do Aluno</h1>

          <p className="text-gray-500 mt-2">Informações do aluno.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <p className="text-sm text-gray-500">Nome</p>

              <p className="text-lg font-semibold">{student.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">E-mail</p>

              <p className="text-lg font-semibold">{student.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Número do Crachá</p>

              <p className="text-lg font-semibold">{student.numberCard}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>

              <LabelWithCircle
                status={student.enabled ? "positive" : "negative"}
                text={student.enabled ? "Ativo" : "Inativo"}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Turmas</h2>

          <p className="text-gray-500 mb-6">
            Turmas em que o aluno está matriculado.
          </p>

          <div className="flex flex-wrap gap-3">
            {student.classGroups.map((group) => (
              <span
                key={group.id}
                className="rounded-lg bg-weg-blue px-4 py-2 text-white font-medium"
              >
                {group.acronym}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href={`/alunos/${student.id}/editar`}>
            <Button className="bg-amber-500 hover:bg-amber-600">Editar</Button>
          </Link>

          <Button className="bg-red-600 hover:bg-red-700">Excluir</Button>
        </div>
      </div>
    </LayoutDesktop>
  );
}
