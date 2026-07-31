'use client'

import { Suspense } from "react";
import { VerifyCodeForm } from "@/components/organisms/VerifyCodeForm";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export default function VerifyCodePage() {
  return (
    <LoginTemplate
      form={
        <Suspense fallback={<div className="text-center text-sm text-gray-500">Carregando...</div>}>
          <VerifyCodeForm />
        </Suspense>
      }
    />
  );
}