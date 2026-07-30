"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import type { CreateEquipment } from "@/lib/api/types";

const equipmentSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe o nome do equipamento.")),
  sap: v.optional(v.string()),
  unitPrice: v.pipe(
    v.string(),
    v.nonEmpty("Informe o preço unitário."),
    v.regex(/^\d+(?:[.,]\d{1,2})?$/, "Informe um preço válido."),
    v.transform((value) => Number(value.replace(",", "."))),
    v.minValue(0, "O preço não pode ser negativo."),
  ),
  availableQuantity: v.pipe(
    v.string(),
    v.nonEmpty("Informe a quantidade disponível."),
    v.regex(/^\d+$/, "Informe uma quantidade inteira válida."),
    v.transform(Number),
    v.minValue(0, "A quantidade não pode ser negativa."),
  ),
});

type EquipmentFormData = v.InferOutput<typeof equipmentSchema>;

interface EquipmentFormProps {
  initialValues?: CreateEquipment;
  submitLabel: string;
  successMessage: string;
  onSubmit: (payload: CreateEquipment) => Promise<void>;
}

export default function EquipmentForm({
  initialValues,
  submitLabel,
  successMessage,
  onSubmit,
}: EquipmentFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [sap, setSap] = useState(initialValues?.sap ?? "");
  const [unitPrice, setUnitPrice] = useState(initialValues?.unitPrice?.toString() ?? "");
  const [availableQuantity, setAvailableQuantity] = useState(
    initialValues?.availableQuantity?.toString() ?? "",
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(equipmentSchema, {
      name,
      sap,
      unitPrice,
      availableQuantity,
    });

    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise os dados informados.");
      return;
    }

    const formData: EquipmentFormData = result.output;
    setSaving(true);

    try {
      await onSubmit({
        name: formData.name,
        sap: formData.sap?.trim() || undefined,
        unitPrice: formData.unitPrice,
        availableQuantity: formData.availableQuantity,
      });
      toast.success(successMessage);
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível salvar o equipamento. Tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input id="name" label="Nome do equipamento *" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Motor WEG 2CV" required />
        <Input id="sap" label="Código SAP" value={sap} onChange={(event) => setSap(event.target.value)} placeholder="Ex.: 123456" />
        <Input id="unitPrice" label="Preço unitário *" type="text" inputMode="decimal" value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} placeholder="Ex.: 199,90" required />
        <Input id="availableQuantity" label="Quantidade disponível *" type="text" inputMode="numeric" value={availableQuantity} onChange={(event) => setAvailableQuantity(event.target.value)} placeholder="Ex.: 10" required />
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <Link href="/equipamentos"><Button type="button" variant="secondary">Cancelar</Button></Link>
        <Button type="submit" icon={Save} disabled={saving}>{saving ? "Salvando..." : submitLabel}</Button>
      </div>
    </form>
  );
}