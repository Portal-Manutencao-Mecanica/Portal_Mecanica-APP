"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

const forgotPasswordSchema = v.object({ email: v.pipe(v.string(), v.trim(), v.email("Informe um e-mail válido.")) });

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(forgotPasswordSchema, { email });
    if (!result.success) { toast.error(result.issues[0]?.message ?? "Informe seu e-mail."); return; }
    setLoading(true);
    try {
      await authService.forgotPassword(result.output.email);
      toast.success("Enviamos as instruções de recuperação para o seu e-mail.");
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível enviar as instruções. Tente novamente."));
    } finally { setLoading(false); }
  }
  return <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6"><Input label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Digite seu e-mail" autoComplete="email" required /><Button type="submit" variant="primary" disabled={loading}>{loading ? "Enviando..." : "Enviar instruções"}</Button></form>;
}