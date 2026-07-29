"use client";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const session = await authService.login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      const requestedPath = new URLSearchParams(window.location.search).get("redirect");
      const safeRedirect =
        requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
          ? requestedPath
          : "/";
      router.replace(
        session.passwordChangeRequired ? "/configuracao" : safeRedirect,
      );
      router.refresh();
    } catch (submitError) {
      toast.error(getServiceErrorMessage(submitError, "Não foi possível entrar. Tente novamente."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="w-full flex flex-col gap-8 md:gap-10"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <Input
          autoComplete="username"
          label="E-mail ou usuário"
          name="email"
          placeholder="Insira seu e-mail ou usuário"
          required
          type="text"
        />
        <Input
          autoComplete="current-password"
          label="Senha"
          name="password"
          type="password"
          placeholder="Insira sua senha"
          required
        />
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Acessar"}
      </Button>

      {process.env.NODE_ENV === "development" && (
        <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800">
          Acesso de teste: <strong>admin@teste.local</strong> / <strong>Senha@123</strong>
        </p>
      )}

      <p className="pt-2 text-center text-sm text-gray-700">
        <Link
          href="/login/forgot-password"
          className="font-bold hover:underline"
        >
          Esqueceu sua senha? Clique aqui
        </Link>
      </p>
    </form>
  );
}
