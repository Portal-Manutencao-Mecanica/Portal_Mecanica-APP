"use client";

import { useState } from "react";
import Link from "next/link";

import Button from "../atoms/Button";
import LabelWithCircle from "./LabelWithCircle";
import ConfirmDialog from "../organisms/ConfirmDialog";

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
  const [open, setOpen] = useState(false);

  function handleDelete() {
    console.log("Excluir aluno:", id);

    // Futuramente:
    // await api.delete(`/students/${id}`);

    setOpen(false);
  }

  return (
    <>
      <div className="grid grid-cols-[2fr_2fr_1fr_2fr_1fr_2fr] items-center border-t border-gray-100 px-6 py-5 hover:bg-gray-50 transition-colors">
        <span className="font-semibold">{name}</span>

        <span>{email}</span>

        <span>{numberCard}</span>

        <span className="truncate">{classGroups.join(", ")}</span>

        <LabelWithCircle
          status={enabled ? "positive" : "negative"}
          text={enabled ? "Ativo" : "Inativo"}
        />

        <div className="flex justify-end gap-2">
          <Link href={`/alunos/${id}`}>
            <Button>Ver</Button>
          </Link>

          <Link href={`/alunos/${id}/editar`}>
            <Button className="bg-amber-500 hover:bg-amber-600">
              Editar
            </Button>
          </Link>

          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setOpen(true)}
          >
            Excluir
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={open}
        title="Excluir Aluno"
        description={`Tem certeza que deseja excluir o aluno "${name}"?`}
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}