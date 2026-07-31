"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

const passwordSchema = v.pipe(
  v.string(),
  v.minLength(8, "A senha deve ter pelo menos 8 caracteres."),
  v.maxLength(128, "A senha deve ter no máximo 128 caracteres."),
  v.regex(/[A-Z]/, "Inclua pelo menos uma letra maiúscula."),
  v.regex(/[a-z]/, "Inclua pelo menos uma letra minúscula."),
  v.regex(/[0-9]/, "Inclua pelo menos um número."),
  v.regex(/[^A-Za-z0-9]/, "Inclua pelo menos um caractere especial."),
);

const firstAccessSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(
      v.string(),
      v.minLength(1, "Informe a senha temporária."),
    ),
    newPassword: passwordSchema,
    passwordConfirmation: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["passwordConfirmation"]],
      (input) => input.newPassword === input.passwordConfirmation,
      "As senhas digitadas não coincidem.",
    ),
    ["passwordConfirmation"],
  ),
);

export function FirstAccessForm() {
  const router = useRouter();
  const { isLoading, user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login");
    else if (!user.passwordChangeRequired) router.replace("/");
  }, [isLoading, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(firstAccessSchema, {
      currentPassword,
      newPassword,
      passwordConfirmation,
    });

    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise as senhas informadas.");
      return;
    }

    setSubmitting(true);
    try {
      await authService.changePassword(result.output);
      await logout();
      toast.success("Senha atualizada. Entre novamente com a nova senha.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível alterar sua senha."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading || !user || !user.passwordChangeRequired) {
    return <p className="text-sm text-gray-500">Validando sua sessão...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Sua conta usa uma senha temporária. Defina uma nova senha antes de
        continuar.
      </p>

      <Input
        label="Senha temporária"
        type="password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        autoComplete="current-password"
        required
      />
      <Input
        label="Nova senha"
        type="password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        autoComplete="new-password"
        required
      />
      <Input
        label="Confirmar nova senha"
        type="password"
        value={passwordConfirmation}
        onChange={(event) => setPasswordConfirmation(event.target.value)}
        autoComplete="new-password"
        required
      />
      <p className="text-xs text-gray-500">
        Use de 8 a 128 caracteres, com maiúscula, minúscula, número e símbolo.
      </p>

      <Button type="submit" className="mt-2 w-full py-3" disabled={submitting}>
        {submitting ? "Alterando..." : "Definir nova senha"}
      </Button>
    </form>
  );
}
