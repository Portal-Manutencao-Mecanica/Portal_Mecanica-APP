"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useAuth } from "@/hooks/useAuth";
import { passwordRequirements, passwordSchema } from "@/lib/validation/password";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

const firstAccessSchema = v.pipe(
  v.object({
    code: v.pipe(
      v.string(),
      v.regex(/^\d{6}$/, "Informe o código de 6 números enviado por e-mail."),
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
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login");
    else if (!user.passwordChangeRequired) router.replace("/");
  }, [isLoading, router, user]);

  async function requestCode() {
    if (requestingCode) return;
    setRequestingCode(true);
    try {
      const response = await authService.requestFirstAccessCode();
      setCodeRequested(true);
      toast.success(response.message);
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível enviar o código."),
      );
    } finally {
      setRequestingCode(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!codeRequested) {
      await requestCode();
      return;
    }

    const result = v.safeParse(firstAccessSchema, {
      code,
      newPassword,
      passwordConfirmation,
    });
    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise os dados informados.");
      return;
    }

    setSubmitting(true);
    try {
      await authService.completeFirstAccess(result.output);
      await logout();
      toast.success("Senha definitiva cadastrada. Entre novamente para continuar.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível concluir o primeiro acesso."),
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
        Sua conta usa uma senha temporária. Para liberar o portal, enviaremos um
        código de verificação para <strong>{user.email}</strong>.
      </p>

      {codeRequested && (
        <>
          <Input
            label="Código de verificação"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
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
            {passwordRequirements}
          </p>
        </>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          className="w-full py-3"
          disabled={requestingCode || submitting}
        >
          {submitting
            ? "Concluindo..."
            : requestingCode
              ? "Enviando código..."
              : codeRequested
                ? "Cadastrar senha definitiva"
                : "Enviar código de verificação"}
        </Button>
        {codeRequested && (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={requestingCode || submitting}
            onClick={requestCode}
          >
            Reenviar código
          </Button>
        )}
      </div>
    </form>
  );
}
