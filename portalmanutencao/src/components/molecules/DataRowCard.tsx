import { DataRowCardProps } from "@/props/DataRowCardProps";

export function DataRowCard({
  acronym,
  professors,
  onViewStudents,
}: DataRowCardProps) {
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-md">
      <div className="flex gap-20">
        <div>
          <p className="font-semibold">Sigla</p>
          <p>{acronym}</p>
        </div>

        <div>
          <p className="font-semibold">Professores</p>
          <p>{professors.join(", ")}</p>
        </div>
      </div>

      <button onClick={onViewStudents}>Ver alunos</button>
    </div>
  );
}
