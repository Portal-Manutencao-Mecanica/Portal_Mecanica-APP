"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import { useAuth } from "@/hooks/useAuth";
import type {
  ClassGroup,
  ManagedUser,
  Organization,
  UserRole,
} from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
import { organizationService } from "@/services/organizationService";

const userSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(3, "Informe o nome do usuário."),
    v.maxLength(150, "O nome deve possuir no máximo 150 caracteres."),
  ),
  email: v.pipe(v.string(), v.trim(), v.email("Informe um e-mail válido.")),
  numberCard: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Informe o número do crachá."),
    v.maxLength(100, "O crachá deve possuir no máximo 100 caracteres."),
  ),
  organizationId: v.pipe(v.string(), v.minLength(1, "Selecione a organização.")),
  role: v.picklist(
    ["ALUNO", "PROFESSOR", "COORDENADOR", "ADMIN"],
    "Selecione o perfil do usuário.",
  ),
});

export interface UserFormValues {
  name: string;
  email: string;
  numberCard: string;
  organizationId: string;
  role: UserRole;
  classGroupIds: string[];
}

interface UserFormProps {
  mode: "create" | "edit";
  initialValues?: ManagedUser;
  cancelHref: string;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

type FormErrors = Partial<Record<keyof Omit<UserFormValues, "classGroupIds">, string>>;

const roleLabels: Record<UserRole, string> = {
  ALUNO: "Aluno",
  PROFESSOR: "Professor",
  COORDENADOR: "Coordenador",
  ADMIN: "Administrador",
};

export default function UserForm({
  mode,
  initialValues,
  cancelHref,
  onSubmit,
}: UserFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [numberCard, setNumberCard] = useState(initialValues?.numberCard ?? "");
  const [organizationId, setOrganizationId] = useState(
    initialValues?.organization.id ?? "",
  );
  const [role, setRole] = useState<UserRole | "">(initialValues?.role ?? "");
  const [classGroupIds, setClassGroupIds] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const roleOptions = useMemo<Record<string, string>>(
    () => user?.role === "ADMIN"
      ? roleLabels
      : {
          ALUNO: roleLabels.ALUNO,
          PROFESSOR: roleLabels.PROFESSOR,
        },
    [user?.role],
  );
  const organizationOptions = useMemo(
    () => Object.fromEntries(
      organizations
        .filter((organization) => organization.active || organization.id === organizationId)
        .map((organization) => [organization.id, organization.name]),
    ),
    [organizationId, organizations],
  );

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        const [organizationPage, classGroupPage] = await Promise.all([
          organizationService.list({ size: 1000, sort: "name,asc" }),
          mode === "create"
            ? classGroupBrowserService.list({ size: 1000, sort: "acronym,asc", enabled: true })
            : Promise.resolve(null),
        ]);
        if (!active) return;
        setOrganizations(organizationPage.content);
        setClassGroups(classGroupPage?.content ?? []);
      } catch (error) {
        if (active) {
          toast.error(
            getServiceErrorMessage(error, "Não foi possível carregar as opções do formulário."),
          );
        }
      } finally {
        if (active) setLoadingOptions(false);
      }
    }

    void loadOptions();
    return () => {
      active = false;
    };
  }, [mode]);

  function toggleClassGroup(id: string) {
    setClassGroupIds((current) =>
      current.includes(id)
        ? current.filter((classGroupId) => classGroupId !== id)
        : [...current, id],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(userSchema, {
      name,
      email,
      numberCard,
      organizationId,
      role,
    });

    if (!result.success) {
      const nextErrors: FormErrors = {};
      result.issues.forEach((issue) => {
        const key = issue.path?.[0]?.key;
        if (typeof key === "string" && !(key in nextErrors)) {
          nextErrors[key as keyof FormErrors] = issue.message;
        }
      });
      setErrors(nextErrors);
      toast.error(result.issues[0]?.message ?? "Revise os dados do usuário.");
      return;
    }

    if (showClassGroups && classGroupIds.length === 0) {
      toast.error("Selecione ao menos uma turma para o usuário.");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      await onSubmit({
        ...result.output,
        classGroupIds,
      });
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível salvar o usuário."));
    } finally {
      setSaving(false);
    }
  }

  const showClassGroups = mode === "create" && (role === "ALUNO" || role === "PROFESSOR");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-5 rounded-xl border border-gray-200 bg-weg-card-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Informações gerais</h2>
          <p className="mt-1 text-sm text-gray-500">
            {mode === "create"
              ? "Cadastre uma pessoa por vez. O nome de usuário será gerado automaticamente."
              : "Atualize os dados cadastrais do usuário."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="user-name"
            label="Nome *"
            value={name}
            maxLength={150}
            error={errors.name}
            onChange={(event) => setName(event.target.value)}
            disabled={saving}
          />
          <Input
            id="user-email"
            label="E-mail *"
            type="email"
            value={email}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={saving}
          />
          <Input
            id="user-number-card"
            label="Número do crachá *"
            value={numberCard}
            maxLength={100}
            error={errors.numberCard}
            onChange={(event) => setNumberCard(event.target.value)}
            disabled={saving}
          />
          <DropDown
            id="user-organization"
            label="Organização *"
            defaultSelection="Selecione a organização"
            enumData={organizationOptions}
            value={organizationId}
            error={errors.organizationId}
            onSelect={setOrganizationId}
            disabled={saving || loadingOptions}
          />
          <DropDown
            id="user-role"
            label="Perfil *"
            defaultSelection="Selecione o perfil"
            enumData={roleOptions}
            value={role}
            error={errors.role}
            onSelect={(value) => {
              setRole(value as UserRole | "");
              setClassGroupIds([]);
            }}
            disabled={mode === "edit" || saving}
          />
        </div>
      </section>

      {showClassGroups && (
        <fieldset className="space-y-4 rounded-xl border border-gray-200 bg-weg-card-white p-6 shadow-sm">
          <legend className="px-1 text-lg font-semibold text-gray-800">Turmas</legend>
          <p className="text-sm text-gray-500">
            Selecione as turmas que devem ser vinculadas ao novo {roleLabels[role].toLowerCase()}.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classGroups.length ? classGroups.map((classGroup) => (
              <label
                key={classGroup.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 hover:border-weg-blue/60"
              >
                <input
                  type="checkbox"
                  checked={classGroupIds.includes(classGroup.id)}
                  onChange={() => toggleClassGroup(classGroup.id)}
                  disabled={saving}
                  className="h-4 w-4 accent-weg-blue"
                />
                <span className="font-medium">{classGroup.acronym}</span>
              </label>
            )) : (
              <p className="text-sm text-gray-500">Nenhuma turma ativa disponível.</p>
            )}
          </div>
        </fieldset>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button href={cancelHref} variant="secondary" disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" icon={Save} disabled={saving || loadingOptions}>
          {saving ? "Salvando..." : mode === "create" ? "Cadastrar usuário" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
