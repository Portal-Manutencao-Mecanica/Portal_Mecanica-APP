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

const resetPasswordSchema = v.pipe(
    v.object({
        password: v.pipe(
            v.string(),
            v.minLength(6, "A senha deve ter pelo menos 6 caracteres.")
        ),
        confirmPassword: v.string(),
    }),
    v.forward(
        v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input) => input.password === input.confirmPassword,
            "As senhas digitadas não coincidem."
        ),
        ["confirmPassword"]
    )
);

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!token) {
            toast.error("Token de verificação não encontrado.");
            return;
        }

        const result = v.safeParse(resetPasswordSchema, { password, confirmPassword });

        if (!result.success) {
            toast.error(result.issues[0]?.message ?? "Verifique os campos informados.");
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword({
                token,
                password: result.output.password,
            });

            toast.success("Senha alterada com sucesso! Faça seu login.");
            router.push("/login");
        } catch (error) {
            toast.error(
                getServiceErrorMessage(
                    error,
                    "Não foi possível redefinir sua senha. Tente novamente."
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

            <div className="flex flex-col gap-4">
                <Input
                    label="Nova senha"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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
                {loading ? "Redefinindo..." : "Redefinir senha"}
            </Button>
        </form>
    );
}