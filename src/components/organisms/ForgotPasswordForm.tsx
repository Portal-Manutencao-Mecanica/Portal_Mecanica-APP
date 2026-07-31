"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [instructionsSent, setInstructionsSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(forgotPasswordSchema, { email });

    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword(result.output.email);
      setInstructionsSent(true);
      toast.success(response.message);
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

      {instructionsSent && (
        <p
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-800"
        >
          Caso o e-mail esteja cadastrado, o link temporário de redefinição foi
          enviado. Consulte também a caixa de spam.
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full py-3 mt-2 rounded-xl bg-[#00579D] hover:bg-[#004077] text-white font-medium shadow-sm transition-all"
      >
        {loading
          ? "Enviando..."
          : instructionsSent
            ? "Reenviar instruções"
            : "Enviar instruções"}
      </Button>
    </form>
  );
}
