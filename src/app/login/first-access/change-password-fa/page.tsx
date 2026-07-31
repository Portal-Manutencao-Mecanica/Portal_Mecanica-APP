'use client'

import { Suspense } from "react";
import { ChangeFirstAccessPasswordForm } from "@/components/organisms/ChangePasswordFaForm";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export default function ChangeFirstAccessPasswordPage() {
    return (
        <LoginTemplate
            form={
                <Suspense fallback={<div className="text-center text-sm text-gray-500">Carregando...</div>}>
                    <ChangeFirstAccessPasswordForm />
                </Suspense>
            }
        />
    );
}