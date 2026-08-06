"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { passwordRequirements, passwordSchema } from "@/lib/validation/password";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

const resetPasswordSchema = v.pipe(
  v.object({
    password: passwordSchema,
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "As senhas digitadas não coincidem.",
    ),
    ["confirmPassword"],
  ),
);

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<
    "validating" | "valid" | "invalid"
  >("validating");
  const effectiveTokenStatus = token ? tokenStatus : "invalid";

  useEffect(() => {
    if (!token) return;

    let active = true;
    authService
      .validateResetToken(token)
      .then((valid) => {
        if (active) setTokenStatus(valid ? "valid" : "invalid");
      })
      .catch(() => {
        if (active) setTokenStatus("invalid");
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (effectiveTokenStatus !== "valid") {
      toast.error("O link de redefinição é inválido ou expirou.");
      return;
    }

    const result = v.safeParse(resetPasswordSchema, {
      password,
      confirmPassword,
    });

    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Verifique os campos informados.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: result.output.password,
        passwordConfirmation: result.output.confirmPassword,
      });
      toast.success("Senha alterada com sucesso! Faça seu login.");
      router.replace("/login");
    } catch (error) {
      toast.error(
        getServiceErrorMessage(
          error,
          "Não foi possível redefinir sua senha. Tente novamente.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#00579D] transition-all hover:underline"
        >
          <Image
            src="/chevron-left.svg"
            alt="Voltar"
            width={16}
            height={16}
            className="h-4 w-4"
          />
          Voltar para o login
        </Link>
      </div>

      {effectiveTokenStatus === "validating" && (
        <p className="text-sm text-gray-500">Validando o link...</p>
      )}
      {effectiveTokenStatus === "invalid" && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          Este link é inválido ou expirou. Solicite uma nova recuperação de
          senha.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <Input
          label="Nova senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Digite sua nova senha"
          autoComplete="new-password"
          className="rounded-xl border-gray-300 focus:border-[#00579D]"
          disabled={effectiveTokenStatus !== "valid"}
          required
        />

        <Input
          label="Confirmar nova senha"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          className="rounded-xl border-gray-300 focus:border-[#00579D]"
          disabled={effectiveTokenStatus !== "valid"}
          required
        />
        <p className="text-xs text-gray-500">
          {passwordRequirements}
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading || effectiveTokenStatus !== "valid"}
        className="mt-2 w-full rounded-xl bg-[#00579D] py-3 font-medium text-white shadow-sm transition-all hover:bg-[#004077]"
      >
        {loading ? "Redefinindo..." : "Redefinir senha"}
      </Button>
    </form>
  );
}
