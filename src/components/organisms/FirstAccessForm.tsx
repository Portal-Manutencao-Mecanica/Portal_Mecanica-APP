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

const firstAccessSchema = v.object({
    email: v.pipe(v.string(), v.trim(), v.email("Informe um e-mail válido.")),
    temporaryPassword: v.pipe(v.string(), v.minLength(1, "Informe a senha temporária.")),
});

export function FirstAccessForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [temporaryPassword, setTemporaryPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const result = v.safeParse(firstAccessSchema, { email, temporaryPassword });

        if (!result.success) {
            toast.error(result.issues[0]?.message ?? "Preencha todos os campos.");
            return;
        }

        setLoading(true);

        try {
            // Valida se a senha temporária fornecida está correta no backend
            await authService.validateTemporaryPassword({
                email: result.output.email,
                temporaryPassword: result.output.temporaryPassword,
            });

            // Avança para a tela de alteração definindo e-mail e a senha temporária na URL ou state
            router.push(
                `/login/first-access/change-password?email=${encodeURIComponent(
                    result.output.email
                )}&tempPass=${encodeURIComponent(result.output.temporaryPassword)}`
            );
        } catch (error) {
            toast.error(
                getServiceErrorMessage(
                    error,
                    "Credenciais incorretas. Verifique seu e-mail e a senha temporária."
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
                    <Image src="/chevron-left.svg" alt="Voltar" width={16} height={16} className="w-4 h-4" />
                    Voltar para o login
                </Link>
            </div>

            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-gray-800">Primeiro Acesso</h2>
                <p className="text-xs text-gray-500">
                    Informe seu e-mail corporativo e a senha temporária recebida para cadastrar sua nova senha.
                </p>
            </div>

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
                    label="Senha temporária"
                    type="password"
                    value={temporaryPassword}
                    onChange={(event) => setTemporaryPassword(event.target.value)}
                    placeholder="Digite sua senha temporária"
                    className="rounded-xl border-gray-300 focus:border-[#00579D]"
                    required
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-[#00579D] hover:bg-[#004077] text-white font-medium shadow-sm transition-all"
            >
                {loading ? "Validando..." : "Avançar"}
            </Button>
        </form>
    );
}