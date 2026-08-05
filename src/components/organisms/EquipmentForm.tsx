"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import type { CreateEquipment } from "@/lib/api/types";
import { getApiFieldErrors, getServiceErrorMessage } from "@/services/httpService";
import UploadedFile64 from "../molecules/UploadedFile64";

// 1. Schema atualizado para incluir a propriedade media (Base64)
const equipmentSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe o nome do equipamento.")),
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
  media: v.optional(v.string()), // 👈 Mídia adicionada ao schema
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
  const [unitPrice, setUnitPrice] = useState(initialValues?.unitPrice?.toString() ?? "");
  const [availableQuantity, setAvailableQuantity] = useState(
    initialValues?.availableQuantity?.toString() ?? "",
  );
  const [media, setMedia] = useState(initialValues?.media ?? "");
  const [saving, setSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerErrors({});

    // 2. Passamos o 'media' para a validação do Valibot
    const result = v.safeParse(equipmentSchema, {
      name,
      unitPrice,
      availableQuantity,
      media,
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
        unitPrice: formData.unitPrice,
        availableQuantity: formData.availableQuantity,
        media: formData.media || undefined, // 👈 Corrigido: agora envia a string Base64 tratada
      });
      toast.success(successMessage);
    } catch (submitError) {
      setServerErrors(getApiFieldErrors(submitError));
      toast.error(getServiceErrorMessage(submitError, "Não foi possível salvar o equipamento."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          id="name"
          label="Nome do equipamento *"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={serverErrors.name}
          placeholder="Ex.: Chave de boca 22 mm"
          required
        />

        <div className="grid gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:grid-cols-3 md:col-span-2">
          <AutomaticIdentifier label="Código SAP" value={initialValues?.sap} />
          <AutomaticIdentifier label="Patrimônio" value={initialValues?.patrimony} />
          <AutomaticIdentifier label="TAG" value={initialValues?.tag} />
          <p className="text-xs text-blue-800 sm:col-span-3">
            Esses identificadores são gerados automaticamente pelo sistema e não podem ser editados.
          </p>
        </div>

        <Input
          id="unitPrice"
          label="Preço unitário *"
          type="text"
          inputMode="decimal"
          value={unitPrice}
          onChange={(event) => setUnitPrice(event.target.value)}
          error={serverErrors.unitPrice}
          placeholder="Ex.: 199,90"
          required
        />

        <Input
          id="availableQuantity"
          label="Quantidade disponível *"
          type="text"
          inputMode="numeric"
          value={availableQuantity}
          onChange={(event) => setAvailableQuantity(event.target.value)}
          error={serverErrors.availableQuantity}
          placeholder="Ex.: 10"
          required
        />

        {/* 3. Componente de Upload ocupando 2 colunas para melhor usabilidade */}
        <div className="md:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Imagem do Equipamento
          </label>
          <UploadedFile64
            onChange={(base64List) => {
              // Pega a primeira imagem convertida em Base64 enviada pelo componente
              setMedia(base64List[0] || "");
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <Button href="/equipamentos" type="button" variant="secondary">Cancelar</Button>
        <Button type="submit" icon={Save} disabled={saving}>
          {saving ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function AutomaticIdentifier({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-wide text-blue-700">
        {label}
      </span>
      <span className="mt-1 block text-sm font-medium text-gray-800">
        {value || "Gerado ao salvar"}
      </span>
    </div>
  );
}
