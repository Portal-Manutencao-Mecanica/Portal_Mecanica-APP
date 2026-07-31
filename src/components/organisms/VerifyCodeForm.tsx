"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";

const verifyCodeSchema = v.object({
    code: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(6, "O código deve ter 6 dígitos."),
        v.maxLength(6, "O código deve ter 6 dígitos.")
    ),
});

export function VerifyCodeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = v.safeParse(verifyCodeSchema, { code });

        if (!result.success) {
            toast.error(result.issues[0]?.message ?? "Informe o código de 6 dígitos.");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.verifyCode({
                email,
                code: result.output.code,
            });

            toast.success("Código validado com sucesso!");

            const token = response.token ?? result.output.code;
            router.push(`/login/forgot-password/reset-password?token=${encodeURIComponent(token)}`);
        } catch (error) {
            toast.error(
                getServiceErrorMessage(
                    error,
                    "Código inválido ou expirado. Verifique e tente novamente."
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
                    href="/login/forgot-password"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#00579D] hover:underline transition-all"
                >
                    <Image
                        src="/chevron-left.svg"
                        alt="Voltar"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                    />
                    Voltar
                </Link>
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500">
                    Insira o código de 6 dígitos enviado para{" "}
                    <span className="font-semibold text-gray-700">{email || "seu e-mail"}</span>.
                </p>
            </div>

            <Input
                label="Código de verificação"
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Digite os 6 dígitos"
                maxLength={6}
                className="rounded-xl border-gray-300 focus:border-[#00579D] text-center tracking-widest text-lg font-bold"
                required
            />

            <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-[#00579D] hover:bg-[#004077] text-white font-medium shadow-sm transition-all"
            >
                {loading ? "Validando..." : "Validar código"}
            </Button>
        </form>
    );
}