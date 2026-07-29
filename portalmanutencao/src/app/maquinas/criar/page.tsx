"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine } from "@/lib/api/types";
import { machineService } from "@/services/machineService";

export default function CreateMachinePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    patrimony: "",
    condition: "ATIVA" as Machine["condition"],
    tag: "",
    placeId: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await machineService.create(form);
    router.push("/maquinas");
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <div className="ui-surface mx-auto max-w-7xl p-8">
        <h1 className="text-3xl font-bold">Nova máquina</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Nome *" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="Patrimônio *" required value={form.patrimony} onChange={(event) => setForm({ ...form, patrimony: event.target.value })} />
            <Input label="Tag" value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} />
            <Input label="ID do local *" required value={form.placeId} onChange={(event) => setForm({ ...form, placeId: event.target.value })} />
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
            <Button type="submit">Cadastrar máquina</Button>
          </div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
