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

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(loginSchema, { email, password });
    if (!result.success) { toast.error(result.issues[0]?.message ?? "Revise os dados de acesso."); return; }
    setLoading(true);
    try {
      const session = await authService.login(result.output);
      localStorage.setItem("@App:user", JSON.stringify(session.user));
      localStorage.setItem("@App:accessToken", session.accessToken);
      localStorage.setItem("@App:refreshToken", session.refreshToken);
      localStorage.setItem("@App:accessToken", session.accessToken);
      localStorage.setItem("@App:refreshToken", session.refreshToken);
      toast.success("Acesso realizado com sucesso.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível entrar. Verifique seu e-mail e senha."));
    } finally { setLoading(false); }
  }

  return <form onSubmit={handleSubmit} className="flex w-full flex-col gap-12 md:gap-12"><div className="flex flex-col gap-4"><Input label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Digite seu e-mail" autoComplete="email" required /><Input label="Senha" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" autoComplete="current-password" required /></div><Button type="submit" variant="primary" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button><p className="pt-2 text-center text-sm text-gray-700"><Link href="/login/forgot-password" className="font-bold hover:underline">Esqueceu sua senha? Clique aqui.</Link></p></form>;
}