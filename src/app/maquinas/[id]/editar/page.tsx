"use client";

import { FormEvent, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";

const machineSchema = v.object({
  patrimony: v.pipe(v.string(), v.trim(), v.nonEmpty("Informe o número de patrimônio.")),
  name: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe o nome da máquina.")),
  condition: v.picklist(["CONFORME", "NAO_CONFORME"], "Selecione a condição."),
  tag: v.optional(v.string()),
});

const emptyMachine: {
  patrimony: string;
  name: string;
  condition: "CONFORME" | "NAO_CONFORME";
  tag: string;
} = { patrimony: "", name: "", condition: "CONFORME", tag: "" };

interface PageProps { params: Promise<{ id: string }>; }

export default function EditMachinePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState(emptyMachine);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadMachine() {
      try {
        const machine = await machineService.getById(id);
        setForm({ patrimony: machine.patrimony, name: machine.name, condition: machine.condition, tag: machine.tag ?? "" });
      } catch (error) {
        toast.error(getServiceErrorMessage(error, "Não foi possível carregar a máquina."));
      } finally {
        setLoading(false);
      }
    }

    void loadMachine();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = v.safeParse(machineSchema, form);
    if (!validation.success) {
      toast.error(validation.issues[0]?.message ?? "Revise os dados da máquina.");
      return;
    }

    setSaving(true);
    try {
      await machineService.update(id, { ...validation.output, tag: validation.output.tag ?? "" });
      toast.success("Máquina atualizada com sucesso.");
      router.push(`/maquinas/${id}`);
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível atualizar a máquina."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
        <div><h1 className="text-2xl font-bold">Editar máquina</h1><p className="text-gray-500">Atualize os dados da máquina e salve as alterações.</p></div>
        {loading ? <p className="text-sm text-gray-500">Carregando máquina...</p> : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input label="Número de patrimônio *" value={form.patrimony} onChange={(event) => setForm({ ...form, patrimony: event.target.value })} />
              <Input label="Nome da máquina *" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <DropDown label="Condição *" defaultSelection="Selecione uma condição" enumData={{ CONFORME: "Conforme", NAO_CONFORME: "Não conforme" }} value={form.condition} onSelect={(value) => setForm({ ...form, condition: value as typeof form.condition })} />
              <Input label="Tag" value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} />
            </div>
            <div className="flex justify-end gap-3 border-t pt-4"><Link href={`/maquinas/${id}`}><Button type="button" variant="secondary">Cancelar</Button></Link><Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</Button></div>
          </form>
        )}
      </div>
    </LayoutDesktop>
  );
}
