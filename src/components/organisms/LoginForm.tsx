"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { getServiceErrorMessage } from "@/services/httpService";
import { useAuth } from "@/hooks/useAuth";

const TEST_USERS = [
  { label: "Administrador", email: "admin@teste.local" },
  { label: "Coordenador", email: "coordenador@teste.local" },
  { label: "Professor", email: "professor@teste.local" },
  { label: "Aluno", email: "aluno@teste.local" },
] as const;

const TEST_PASSWORD = "Senha@123";

const loginSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email("Informe um e-mail válido.")),
  password: v.pipe(v.string(), v.minLength(1, "Informe sua senha.")),
});

export function LoginForm() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading: isLoadingSession,
    login,
    user: authenticatedUser,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoadingSession) {
      router.replace(
        authenticatedUser?.passwordChangeRequired ? "/primeiro-acesso" : "/"
      );
    }
  }, [authenticatedUser, isAuthenticated, isLoadingSession, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(loginSchema, { email, password });

    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise os dados de acesso.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(result.output);

      toast.success("Acesso realizado com sucesso.");
      if (user.passwordChangeRequired) {
        router.push("/primeiro-acesso");
      } else {
        const returnTo = new URLSearchParams(window.location.search).get(
          "returnTo"
        );
        router.push(
          returnTo?.startsWith("/") && !returnTo.startsWith("//")
            ? returnTo
            : "/"
        );
      }
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível entrar. Verifique seu e-mail e senha."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Digite seu e-mail"
          autoComplete="email"
          className="rounded-xl border-gray-300 focus:border-[#00579D]"
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Digite sua senha"
          autoComplete="current-password"
          className="rounded-xl border-gray-300 focus:border-[#00579D]"
          required
        />
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
          <p className="mb-2 text-xs font-semibold text-gray-700">
            Contas de teste do Flyway
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TEST_USERS.map((testUser) => (
              <button
                key={testUser.email}
                type="button"
                onClick={() => {
                  setEmail(testUser.email);
                  setPassword(TEST_PASSWORD);
                }}
                className="rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs font-medium text-[#00579D] transition-colors hover:bg-blue-100"
              >
                {testUser.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Selecione um perfil para preencher as credenciais de
            desenvolvimento.
          </p>
        </div>
      )}

      {/* Link de 'Esqueceu sua senha' com fonte e cor padronizadas */}
      <div className="flex items-center justify-start pt-1">
        <Link
          href="/login/forgot-password"
          className="text-xs font-semibold text-[#00579D] hover:underline transition-all"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading || isLoadingSession}
        className="w-full py-3 mt-2 rounded-xl bg-[#00579D] hover:bg-[#004077] text-white font-medium shadow-sm transition-all"
      >
        {loading || isLoadingSession ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
