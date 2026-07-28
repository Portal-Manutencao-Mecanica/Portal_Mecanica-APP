"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine } from "@/lib/api/types";
import { machineService } from "@/services/machineService";

export default function ViewMachinePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    machineService.getById(id).then(setMachine).catch(() => setMachine(null));
  }, [id]);

  async function handleDelete() {
    await machineService.remove(id);
    router.push("/maquinas");
    router.refresh();
  }

  if (!machine) {
    return <LayoutDesktop><p className="ui-surface p-8 text-gray-500">Carregando máquina...</p></LayoutDesktop>;
  }

  const status = machine.condition === "ATIVA" ? "positive" : machine.condition === "MANUTENCAO" ? "warning" : "negative";

  return (
    <LayoutDesktop>
      <div className="ui-page">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div><h1 className="text-3xl font-bold">{machine.name}</h1><p className="text-sm text-gray-500">Patrimônio: {machine.patrimony}</p></div>
          <div className="flex gap-3">
            <Link href="/maquinas"><Button variant="secondary">Voltar</Button></Link>
            <Link href={`/maquinas/${id}/editar`}><Button variant="warning">Editar</Button></Link>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Excluir</Button>
          </div>
        </div>
        <div className="ui-surface grid gap-6 p-6 md:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase text-gray-400">Condição</p><LabelWithCircle status={status} text={machine.condition} /></div>
          <Detail label="Localização" value={machine.placeName} />
          <Detail label="Tag" value={machine.tag || "-"} />
          <Detail label="Data de cadastro" value={new Intl.DateTimeFormat("pt-BR").format(new Date(machine.createdAt))} />
        </div>
      </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="ui-surface w-full max-w-md space-y-4 p-6">
            <h2 className="text-xl font-bold">Excluir máquina</h2>
            <p>Tem certeza que deseja excluir <strong>{machine.name}</strong>?</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
              <Button variant="danger" onClick={handleDelete}>Excluir</Button>
            </div>
          </div>
        </div>
      )}
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-semibold uppercase text-gray-400">{label}</p><p className="font-medium">{value}</p></div>;
}
