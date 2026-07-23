import Link from "next/link";

import Button from "../atoms/Button";
import LabelWithCircle from "./LabelWithCircle";

interface Props {
  id: number;
  name: string;
  email: string;
  numberCard: string;
  enabled: boolean;
  classGroups: string[];
}

export function StudentRow({
  id,
  name,
  email,
  numberCard,
  enabled,
  classGroups,
}: Props) {
  return (
    <div className="grid grid-cols-6 items-center border-t border-gray-100 px-6 py-5">
      <span className="font-medium">{name}</span>

      <span>{email}</span>

      <span>{numberCard}</span>

      <span>{classGroups.join(", ")}</span>

      <LabelWithCircle
        status={enabled ? "positive" : "negative"}
        text={enabled ? "Ativo" : "Inativo"}
      />

      <div className="flex justify-end gap-2">
        <Link href={`/alunos/${id}`}>
          <Button>Ver</Button>
        </Link>

        <Link href={`/alunos/${id}/editar`}>
          <Button className="bg-amber-500 hover:bg-amber-600">Editar</Button>
        </Link>

        <Button className="bg-red-600 hover:bg-red-700">Excluir</Button>
      </div>
    </div>
  );
}
