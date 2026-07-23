"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/atoms/Button";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";

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
  ],
};

export default function StudentPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [open, setOpen] = useState(false);

  function handleDelete() {
    console.log("Excluir aluno:", student.id);

    // Futuramente:
    // await api.delete(`/students/${student.id}`);

    setOpen(false);
    router.push("/alunos");
  }

  return (
    <LayoutDesktop>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">

        <div className="rounded-xl border border-gray-200 border-t-8 border-t-weg-blue bg-white shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Perfil do Aluno</h1>

              <p className="text-gray-500 mt-2">Informações do aluno.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/alunos/${student.id}/editar`}>
                <Button className="bg-amber-500 hover:bg-amber-600 w-full">
                  Editar
                </Button>
              </Link>

              <Button
                className="bg-red-600 hover:bg-red-700 w-full"
                onClick={() => setOpen(true)}
              >
                Excluir
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="text-lg font-semibold">{student.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Número do Crachá</p>
              <p className="text-lg font-semibold">{student.numberCard}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">E-mail</p>
              <p className="text-lg font-semibold">{student.email}</p>
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
          <h2 className="text-2xl font-semibold mb-5">Turmas</h2>

          <div className="flex flex-wrap gap-3">
            {student.classGroups.map((group) => (
              <span
                key={group.id}
                className="rounded-lg bg-weg-blue px-4 py-2 text-white"
              >
                {group.acronym}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={open}
        title="Excluir Aluno"
        description={`Tem certeza que deseja excluir o aluno "${student.name}"?`}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </LayoutDesktop>
  );
}
