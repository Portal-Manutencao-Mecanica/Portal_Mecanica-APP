"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { equipmentService } from "@/services/equipmentService";

export default function EditEquipmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", sap: "", unitPrice: "", availableQuantity: "" });

  useEffect(() => {
    equipmentService.getById(id).then((equipment) => setForm({
      name: equipment.name,
      sap: equipment.sap ?? "",
      unitPrice: String(equipment.unitPrice),
      availableQuantity: String(equipment.availableQuantity),
    }));
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await equipmentService.update(id, {
      name: form.name,
      sap: form.sap,
      unitPrice: Number(form.unitPrice),
      availableQuantity: Number(form.availableQuantity),
    });
    router.push(`/equipamentos/${id}`);
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <div className="ui-surface mx-auto max-w-7xl p-8">
        <h1 className="text-3xl font-bold">Editar equipamento</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Nome *" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="Código SAP" value={form.sap} onChange={(event) => setForm({ ...form, sap: event.target.value })} />
            <Input label="Valor unitário *" required type="number" min="0" step="0.01" value={form.unitPrice} onChange={(event) => setForm({ ...form, unitPrice: event.target.value })} />
            <Input label="Quantidade *" required type="number" min="0" value={form.availableQuantity} onChange={(event) => setForm({ ...form, availableQuantity: event.target.value })} />
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
