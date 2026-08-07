"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import { materialTypeLabels } from "@/components/molecules/MaterialCard";
import type {
  CreateHelperMaterial,
  HelperMaterial,
  HelperMaterialType,
} from "@/lib/api/types";
import { getApiFieldErrors, getServiceErrorMessage } from "@/services/httpService";

interface SupportMaterialFormProps {
  initialValues?: HelperMaterial;
  submitLabel: string;
  successMessage: string;
  onSubmit: (payload: CreateHelperMaterial) => Promise<void>;
}

export default function SupportMaterialForm({
  initialValues,
  submitLabel,
  successMessage,
  onSubmit,
}: SupportMaterialFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [url, setUrl] = useState(initialValues?.url ?? "");
  const [type, setType] = useState<HelperMaterialType | "">(initialValues?.type ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const errors: Record<string, string> = {};

    if (!title.trim()) errors.title = "Informe o título do material.";
    if (!url.trim()) {
      errors.url = "Informe o endereço do material.";
    } else {
      try {
        new URL(url.trim());
      } catch {
        errors.url = "Informe uma URL válida.";
      }
    }
    if (!type) errors.type = "Selecione o tipo do material.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !validate() || !type) return;

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        url: url.trim(),
        type,
      });
      toast.success(successMessage);
    } catch (submitError) {
      setFieldErrors(getApiFieldErrors(submitError));
      toast.error(getServiceErrorMessage(submitError, "Não foi possível salvar o material de apoio."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-weg-card-white p-6 shadow-sm">
        <div className="mb-5 space-y-1">
          <h2 className="text-lg font-semibold text-gray-800">Informações do material</h2>
          <p className="text-sm text-gray-500">
            Informe um link acessível para que os usuários possam consultar o conteúdo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="support-material-title"
            label="Título *"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            error={fieldErrors.title}
            maxLength={160}
            required
          />
          <DropDown
            id="support-material-type"
            label="Tipo *"
            defaultSelection="Selecione o tipo"
            enumData={materialTypeLabels}
            value={type}
            onSelect={(value) => {
              setType(value as HelperMaterialType);
              setFieldErrors((current) => ({ ...current, type: "" }));
            }}
            error={fieldErrors.type}
            allowEmptySelection={false}
          />
          <div className="md:col-span-2">
            <Input
              id="support-material-url"
              label="Endereço (URL) *"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              error={fieldErrors.url}
              placeholder="https://exemplo.com/material"
              required
            />
          </div>
          <div className="md:col-span-2">
            <TextArea
              id="support-material-description"
              label="Descrição"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              error={fieldErrors.description}
              maxLength={1000}
              placeholder="Descreva o conteúdo e a finalidade do material."
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button href="/maquinas/material-complementar" variant="secondary" disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" icon={Save} disabled={saving}>
          {saving ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
