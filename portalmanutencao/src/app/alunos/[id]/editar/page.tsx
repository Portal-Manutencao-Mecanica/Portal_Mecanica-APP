import Link from "next/link";

import Button from "@/components/atoms/Button";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

const student = {
  id: 1,
  name: "Carlos Henrique",
  email: "carlos@weg.com",
  numberCard: "123456",
  enabled: true,
};

export default function EditStudentPage() {
  return (
    <LayoutDesktop>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">


        <div className="rounded-xl border border-gray-200 border-t-8 border-t-weg-blue bg-white shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold">Editar Aluno</h1>

          <p className="text-gray-500 mt-2">
            Atualize as informações do aluno.
          </p>

          <form className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Nome</label>

                <input
                  defaultValue={student.name}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-weg-blue"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">E-mail</label>

                <input
                  type="email"
                  defaultValue={student.email}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-weg-blue"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Número do Crachá
                </label>

                <input
                  defaultValue={student.numberCard}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-weg-blue"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Status</label>

                <select
                  defaultValue={student.enabled ? "true" : "false"}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-weg-blue"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse md:flex-row justify-end gap-3">
              <Link href={`/alunos/${student.id}`}>
                <Button className="bg-gray-500 hover:bg-gray-600 w-full md:w-auto">
                  Cancelar
                </Button>
              </Link>

              <Button className="w-full md:w-auto">Salvar Alterações</Button>
            </div>
          </form>
        </div>
      </div>
    </LayoutDesktop>
  );
}
