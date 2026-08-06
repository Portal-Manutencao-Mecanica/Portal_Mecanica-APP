"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import type {
  Organization,
  OrganizationPayload,
  OrganizationType,
} from "@/lib/api/types";
import { getApiFieldErrors, getServiceErrorMessage } from "@/services/httpService";

const organizationSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, "Informe o nome da organização."),
    v.maxLength(150, "O nome deve possuir no máximo 150 caracteres."),
  ),
  type: v.picklist(["SENAI", "WEG", "OTHER"], "Selecione o tipo da organização."),
  emailDomain: v.pipe(
    v.string(),
    v.trim(),
    v.toLowerCase(),
    v.regex(
      /^(?!-)(?:[a-z0-9-]+\.)+[a-z]{2,}$/,
      "Informe um domínio válido, como empresa.com.br.",
    ),
  ),
});

const organizationTypeLabels: Record<OrganizationType, string> = {
  SENAI: "SENAI",
  WEG: "WEG",
  OTHER: "Outra",
};

interface OrganizationFormProps {
  mode: "create" | "edit";
  initialValues?: Organization;
  onSubmit: (payload: OrganizationPayload) => Promise<void>;
}

type FormErrors = Partial<Record<keyof OrganizationPayload, string>>;

export default function OrganizationForm({
  mode,
  initialValues,
  onSubmit,
}: OrganizationFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [type, setType] = useState<OrganizationType | "">(initialValues?.type ?? "");
  const [emailDomain, setEmailDomain] = useState(initialValues?.emailDomain ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(organizationSchema, { name, type, emailDomain });

    if (!result.success) {
      const nextErrors: FormErrors = {};
      for (const issue of result.issues) {
        const key = issue.path?.[0]?.key;
        if (typeof key === "string" && !(key in nextErrors)) {
          nextErrors[key as keyof OrganizationPayload] = issue.message;
        }
      }
      setErrors(nextErrors);
      toast.error(result.issues[0]?.message ?? "Revise os dados da organização.");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      await onSubmit(result.output);
    } catch (submitError) {
      setErrors(getApiFieldErrors(submitError));
      toast.error(
        getServiceErrorMessage(submitError, "Não foi possível salvar a organização."),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-5 rounded-xl border border-gray-200 bg-weg-card-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Informações gerais</h2>
          <p className="mt-1 text-sm text-gray-500">
            O domínio informado deve corresponder aos e-mails dos usuários da organização.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="organization-name"
            label="Nome *"
            value={name}
            maxLength={150}
            error={errors.name}
            onChange={(event) => setName(event.target.value)}
            disabled={saving}
          />
          <DropDown
            id="organization-type"
            label="Tipo *"
            defaultSelection="Selecione o tipo"
            enumData={organizationTypeLabels}
            value={type}
            error={errors.type}
            onSelect={(value) => setType(value as OrganizationType | "")}
            disabled={saving}
          />
          <div className="md:col-span-2">
            <Input
              id="organization-email-domain"
              label="Domínio de e-mail *"
              value={emailDomain}
              maxLength={150}
              placeholder="Ex.: empresa.com.br"
              error={errors.emailDomain}
              onChange={(event) => setEmailDomain(event.target.value)}
              disabled={saving}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button href="/organizacoes" variant="secondary" disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" icon={Save} disabled={saving}>
          {saving
            ? "Salvando..."
            : mode === "create"
              ? "Cadastrar organização"
              : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}

export { organizationTypeLabels };
