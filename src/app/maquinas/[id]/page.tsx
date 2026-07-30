"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";

export default function ViewMachinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    machineService.getById(id).then(setMachine).catch((error) => {
      toast.error(getServiceErrorMessage(error, "Não foi possível carregar a máquina."));
    });
  }, [id]);

  async function remove() {
    try {
      await machineService.remove(id);
      toast.success("Máquina excluída com sucesso.");
      router.push("/maquinas");
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível excluir a máquina."));
    }
  }

  if (!machine) return <LayoutDesktop><p className="p-8 text-center text-gray-500">Carregando máquina...</p></LayoutDesktop>;

  const isConforming = machine.condition === "CONFORME";

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="flex justify-between">
          <div><h1 className="text-3xl font-bold">{machine.name}</h1><p className="text-gray-500">Patrimônio: {machine.patrimony}</p></div>
          <div className="flex gap-2"><Link href="/maquinas"><Button variant="secondary">Voltar</Button></Link><Link href={`/maquinas/${id}/editar`}><Button variant="warning">Editar</Button></Link><Button variant="danger" onClick={() => setOpen(true)}>Excluir</Button></div>
        </div>
        <div className="grid grid-cols-1 gap-6 rounded-xl border bg-white p-6 md:grid-cols-2">
          <Detail label="Condição"><LabelWithCircle status={isConforming ? "positive" : "negative"} text={isConforming ? "Conforme" : "Não conforme"} /></Detail>
          <Detail label="Local">{machine.placeName}</Detail>
          <Detail label="Tag">{machine.tag || "Não informada"}</Detail>
          <Detail label="Criada em">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(machine.createdAt))}</Detail>
        </div>
      </div>
      <ConfirmDialog open={open} title="Excluir máquina" description={`Tem certeza que deseja excluir ${machine.name}?`} onCancel={() => setOpen(false)} onConfirm={remove} />
    </LayoutDesktop>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-sm text-gray-500">{label}</p><div className="mt-1 font-medium">{children}</div></div>;
}
