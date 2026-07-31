'use client'

import { Suspense } from "react";
import { LoginTemplate } from "@/components/templates/LoginTemplate";
import { ResetPasswordForm } from "@/components/organisms/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <LoginTemplate
            title="Redefinir senha"
            subtitle="Crie uma nova senha para acessar o portal"
            form={
                <Suspense fallback={<div className="text-center text-sm text-gray-500">Carregando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            }
        />
    );
}
