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

const changePasswordSchema = v.pipe(
    v.object({
        newPassword: v.pipe(v.string(), v.minLength(6, "A nova senha deve ter pelo menos 6 caracteres.")),
        confirmPassword: v.string(),
    }),
    v.forward(
        v.partialCheck(
            [["newPassword"], ["confirmPassword"]],
            (input) => input.newPassword === input.confirmPassword,
            "As senhas digitadas não coincidem."
        ),
        ["confirmPassword"]
    )
);

export function ChangeFirstAccessPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pega o e-mail e a senha temporária enviados pela URL
    const email = searchParams.get("email") ?? "";
    const temporaryPassword = searchParams.get("tempPass") ?? "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!temporaryPassword) {
            toast.error("Sessão inválida. Por favor, reinicie o primeiro acesso.");
            router.push("/login/first-access");
            return;
        }

        const result = v.safeParse(changePasswordSchema, {
            newPassword,
            confirmPassword,
        });

        if (!result.success) {
            toast.error(result.issues[0]?.message ?? "Verifique os campos digitados.");
            return;
        }

        setLoading(true);

        try {
            await authService.completeFirstAccess({
                email,
                temporaryPassword, // Envia a senha obtida automaticamente da etapa anterior
                newPassword: result.output.newPassword,
            });

            toast.success("Cadastro concluído com sucesso! Faça seu login.");
            router.push("/login");
        } catch (error) {
            toast.error(
                getServiceErrorMessage(
                    error,
                    "Não foi possível cadastrar a nova senha. Tente novamente."
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
                    href="/login/first-access"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#00579D] hover:underline transition-all"
                >
                    <Image src="/chevron-left.svg" alt="Voltar" width={16} height={16} className="w-4 h-4" />
                    Voltar
                </Link>
            </div>

            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-gray-800">Definir Nova Senha</h2>
                <p className="text-xs text-gray-500">
                    Crie sua nova senha definitiva para prosseguir com o acesso no e-mail{" "}
                    <span className="font-semibold text-gray-700">{email || "informado"}</span>.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <Input
                    label="Nova senha"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Digite sua nova senha"
                    autoComplete="new-password"
                    className="rounded-xl border-gray-300 focus:border-[#00579D]"
                    required
                />

                <Input
                    label="Confirmar nova senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repita a nova senha"
                    autoComplete="new-password"
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
                {loading ? "Cadastrando..." : "Concluir cadastro e entrar"}
            </Button>
        </form>
    );
}