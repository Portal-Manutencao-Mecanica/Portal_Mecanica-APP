'use client'

import { Suspense } from "react";
import { LoginTemplate } from "@/components/templates/LoginTemplate";
import { ResetPasswordForm } from "@/components/organisms/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <LoginTemplate
            form={
                <Suspense fallback={<div className="text-center text-sm text-gray-500">Carregando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            }
        />
    );
}