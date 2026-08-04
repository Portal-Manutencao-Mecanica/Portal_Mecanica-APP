"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { getServiceErrorMessage } from "@/services/httpService";
import { userService } from "@/services/userService";

const profileSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, "Informe um nome válido."),
    v.maxLength(150, "O nome deve possuir no máximo 150 caracteres."),
  ),
});

export default function ConfigForm() {
  const { isLoading, refreshSession, user } = useAuth();
  const [nameDraft, setNameDraft] = useState<{ userId: string; value: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const name = user && nameDraft?.userId === user.id ? nameDraft.value : user?.name ?? "";

  async function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !user) return;

    const result = v.safeParse(profileSchema, { name });
    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise o nome informado.");
      return;
    }

    setSaving(true);
    try {
      await userService.updateOwnProfile(result.output.name);
      await refreshSession();
      setNameDraft({ userId: user.id, value: result.output.name });
      toast.success("Nome atualizado com sucesso.");
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível atualizar o nome."),
      );
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !user) {
    return <PageFeedback message="Carregando configurações..." />;
  }

  const unchanged = name.trim() === user.name;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie suas informações pessoais e configurações de acesso."
      />

      <form
        onSubmit={saveName}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Dados pessoais</h2>
          <p className="mt-1 text-sm text-gray-500">
            Atualize o nome exibido no sistema. O e-mail da conta não pode ser
            alterado por esta tela.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="profile-name"
            label="Nome"
            value={name}
            onChange={(event) => setNameDraft({ userId: user.id, value: event.target.value })}
            maxLength={150}
            autoComplete="name"
            required
          />
          <Input
            id="profile-email"
            label="E-mail"
            value={user.email}
            disabled
            readOnly
          />
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <Button type="submit" disabled={saving || unchanged || !name.trim()}>
            {saving ? "Salvando..." : "Salvar nome"}
          </Button>
        </div>
      </form>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Segurança</h2>
            <p className="mt-1 text-sm text-gray-500">
              Solicite um link de uso único para redefinir sua senha.
            </p>
          </div>
          <Button href="/login/forgot-password">Trocar senha</Button>
        </div>
      </section>
    </section>
  );
}
