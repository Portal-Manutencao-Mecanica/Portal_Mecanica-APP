"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

const forgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email("Informe um e-mail válido.")),
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(forgotPasswordSchema, { email });

    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(result.output.email);
      toast.success("Enviamos o código de verificação para o seu e-mail.");

      // Redireciona para a rota aninhada do verify-code
      router.push(`/login/forgot-password/verify-code?email=${encodeURIComponent(result.output.email)}`);
    } catch (error) {
      toast.error(
        getServiceErrorMessage(
          error,
          "Não foi possível enviar as instruções. Tente novamente."
        )
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#00579D] hover:underline transition-all"
        >
          <Image
            src="/chevron-left.svg"
            alt="Voltar"
            width={16}
            height={16}
            className="w-4 h-4"
          />
          Voltar para o login
        </Link>
      </div>

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

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full py-3 mt-2 rounded-xl bg-[#00579D] hover:bg-[#004077] text-white font-medium shadow-sm transition-all"
      >
        {loading ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
}