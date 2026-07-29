import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { DataRowCard } from "@/components/molecules/DataRowCard";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { classGroupService } from "@/services/classGroupService";

export default async function TurmasPage() {
  const classGroups = await classGroupService.list().catch(() => null);

  if (!classGroups) {
    return (
      <LayoutDesktop>
        <div className="p-8 space-y-3">
          <h1 className="text-2xl font-bold">Não foi possível carregar as turmas.</h1>
          <p className="text-gray-600">
            Verifique sua sessão e tente novamente em alguns instantes.
          </p>
        </div>
      </LayoutDesktop>
    );
  }

  return (
    <LayoutDesktop>
      <div className="max-w-7xl mx-auto p-8 space-y-5">
        <h1 className="text-3xl font-bold">Turmas</h1>

        {classGroups.length === 0 && (
          <p className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
            Nenhuma turma cadastrada.
          </p>
        )}

        {classGroups.map((group) => (
          <DataRowCard
            key={group.id}
            actions={
              <>
                <Link href={`/turmas/${group.id}`}>
                  <Button icon={Eye} variant="secondary">Visualizar</Button>
                </Link>
                <Link href={`/turmas/${group.id}/editar`}>
                  <Button icon={Pencil} variant="primary">Editar</Button>
                </Link>
                <Button variant="danger" icon={Trash2}>Excluir</Button>
              </>
            }
          >
            <div>
              <h2 className="font-bold">{group.acronym}</h2>
              <p>{group.teachers?.map((teacher) => teacher.name).join(", ")}</p>
            </div>
          </DataRowCard>
        ))}
      </div>
    </LayoutDesktop>
  );
}
