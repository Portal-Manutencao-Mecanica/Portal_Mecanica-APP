import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { DataRowCard } from "@/components/molecules/DataRowCard";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { Eye, Pencil, Trash2} from "lucide-react";

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


export default async function TurmasPage() {

  try {
    const data = await fetch("http:/localhost:8080/api/turma")
    const result = await data.json();
    const classGroups: ClassGroupProps[] = result;

    return (
      <LayoutDesktop>
        <div className="max-w-6xl mx-auto p-8 space-y-5">
          <h1 className="text-3xl font-bold">Turmas</h1>

          {classGroups.map((group) => (
            <DataRowCard
              key={group.id}
              actions={
                <>
                  <Link href={`/turmas/${group.id}`}>
                    <Button icon={Eye} variant="secondary">
                      Visualizar
                    </Button>
                  </Link>

                  <Link href={`/turmas/${group.id}/editar`}>
                    <Button icon={Pencil} variant="primary">
                      Editar
                    </Button>
                  </Link>
                  <Button variant="danger" icon={Trash2}>Excluir</Button>
                </>
              }
            >
              <div>
                <h2 className="font-bold">{group.acronym}</h2>
                <p>{group.teachers.map((teacher) => teacher.name).join(", ")}</p>
              </div>
            </DataRowCard>  
            ))                                                                                                                                                                                                        }
        </div>
      </LayoutDesktop>
    );
  } catch (error) {
    console.log(error);
  }
}