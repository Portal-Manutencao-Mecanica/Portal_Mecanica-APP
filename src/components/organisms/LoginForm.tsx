"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

const loginSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email("Informe um e-mail válido.")),
  password: v.pipe(v.string(), v.minLength(1, "Informe sua senha.")),
});

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = v.safeParse(loginSchema, { email, password });

    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Verifique os dados informados.");
      return;
    }

    setLoading(true);

    try {
      await authService.login({
        email: result.output.email,
        password: result.output.password,
      });

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        getServiceErrorMessage(
          error,
          "E-mail ou senha incorretos. Verifique suas credenciais."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite seu e-mail"
        autoComplete="email"
        className="rounded-xl border-gray-300 focus:border-[#00579D]"
        required
      />

      <div className="flex flex-col gap-2">
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          autoComplete="current-password"
          className="rounded-xl border-gray-300 focus:border-[#00579D]"
          required
        />

        {/* Links ajustados conforme design */}
        <div className="flex items-center justify-between text-xs pt-1">
          <Link
            href="/login/first-access"
            className="font-semibold text-[#00579D] hover:underline transition-all"
          >
            Primeiro acesso?
          </Link>

          {/* Esqueceu a senha em cinza */}
          <Link
            href="/login/forgot-password"
            className="text-gray-400 hover:text-gray-600 hover:underline transition-all"
          >
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full py-3 mt-2 rounded-xl bg-[#00579D] hover:bg-[#004077] text-white font-medium shadow-sm transition-all"
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}