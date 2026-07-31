'use client'

import { FirstAccessForm } from "@/components/organisms/FirstAccessForm";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export default function FirstAccessPage() {
    return <LoginTemplate form={<FirstAccessForm />} />;
}