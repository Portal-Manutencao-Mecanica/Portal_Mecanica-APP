
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { getServiceErrorMessage } from "@/services/httpService";
import { useAuth } from "@/hooks/useAuth";

const TEST_USERS = [
  {
    label: "Administrador",
    identifier: "seed.admin.senai@sesisenai.org.br",
  },
  {
    label: "Coordenador",
    identifier: "seed.marcos.coordenador@sesisenai.org.br",
  },
  {
    label: "Professor",
    identifier: "seed.carlos.rocha@sesisenai.org.br",
  },
  {
    label: "Aluno",
    identifier: "seed.joao.silva.01@sesisenai.org.br",
  },
] as const;

const TEST_PASSWORD = "Senha@123";
const loginSchema = v.object({
  identifier: v.pipe(v.string(), v.trim(), v.minLength(1, "Informe seu e-mail ou username.")),
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
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoadingSession) {
      router.replace(
        authenticatedUser?.passwordChangeRequired ? "/primeiro-acesso" : "/",
      );
    }
  }, [authenticatedUser, isAuthenticated, isLoadingSession, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(loginSchema, { identifier, password });

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
          "returnTo",
        );
        router.push(
          returnTo?.startsWith("/") && !returnTo.startsWith("//")
            ? returnTo
            : "/",
        );
      }
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível entrar. Verifique seu e-mail ou username e senha."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Input
          label="E-mail ou username"
          type="text"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Digite seu e-mail ou username"
          autoComplete="username"
          className="rounded-xl border-gray-300 focus:border-weg-blue"
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Digite sua senha"
          autoComplete="current-password"
          className="rounded-xl border-gray-300 focus:border-weg-blue"
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
                key={testUser.identifier}
                type="button"
                onClick={() => {
                  setIdentifier(testUser.identifier);
                  setPassword(TEST_PASSWORD);
                }}
                className="rounded-lg border border-blue-200 bg-white px-2 py-2 text-xs font-medium text-weg-blue transition-colors hover:bg-blue-100"
              >
                {testUser.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Selecione um perfil para preencher as credenciais de desenvolvimento.
          </p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={loading || isLoadingSession}
        className="w-full py-3 mt-2 rounded-xl bg-weg-blue hover:bg-[#004077] text-white font-medium shadow-sm transition-all"
      >
        {loading || isLoadingSession ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
