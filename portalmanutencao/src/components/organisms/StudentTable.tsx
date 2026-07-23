import { StudentRow } from "../molecules/StudentRow";

interface Student {
  id: number;
  name: string;
  email: string;
  numberCard: string;
  enabled: boolean;
  classGroups: string[];
}

interface Props {
  students: Student[];
}

export function StudentTable({ students }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">

      <div className="min-w-287.5">

        <div className="grid grid-cols-[2fr_2fr_1fr_2fr_1fr_2fr] bg-gray-100 px-6 py-4 font-semibold">

          <span>Nome</span>

          <span>E-mail</span>

          <span>Crachá</span>

          <span>Turmas</span>

          <span>Status</span>

          <span className="text-right">
            Ações
          </span>

        </div>

        {students.map((student) => (
          <StudentRow
            key={student.id}
            {...student}
          />
        ))}

      </div>

    </div>
  );
}