"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine } from "@/lib/api/types";
import { machineService } from "@/services/machineService";

type EditableMachine = Pick<Machine, "name" | "patrimony" | "condition" | "tag">;

export default function EditMachinePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<EditableMachine>({
    name: "",
    patrimony: "",
    condition: "ATIVA",
    tag: "",
  });

  useEffect(() => {
    machineService.getById(id).then((machine) => setForm({
      name: machine.name,
      patrimony: machine.patrimony,
      condition: machine.condition,
      tag: machine.tag,
    }));
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await machineService.update(id, form);
    router.push(`/maquinas/${id}`);
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <div className="ui-surface mx-auto max-w-7xl p-8">
        <h1 className="text-3xl font-bold">Editar máquina</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Nome *" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="Patrimônio *" required value={form.patrimony} onChange={(event) => setForm({ ...form, patrimony: event.target.value })} />
            <Input label="Tag" value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} />
            <div>
              <label htmlFor="condition" className="ui-field-label">Condição</label>
              <select id="condition" className="ui-control mt-1.5" value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value as Machine["condition"] })}>
                <option value="ATIVA">Ativa</option>
                <option value="MANUTENCAO">Manutenção</option>
                <option value="INATIVA">Inativa</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit">Salvar alterações</Button>
          </div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
