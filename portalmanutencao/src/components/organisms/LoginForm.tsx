"use client";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const session = await authService.login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      router.replace(session.passwordChangeRequired ? "/configuracao" : "/");
      router.refresh();
    } catch (submitError) {
      setError(getServiceErrorMessage(submitError, "Não foi possível entrar. Tente novamente."));
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
          autoComplete="email"
          label="E-mail"
          name="email"
          placeholder="Insira seu e-mail"
          required
          type="email"
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

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Acessar"}
      </Button>

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
