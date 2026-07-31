'use client'

import { LoginForm } from "@/components/organisms/LoginForm";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export default function LoginPage() {
  return (
    <LoginTemplate
     form={<LoginForm/>}
    />
  );
}