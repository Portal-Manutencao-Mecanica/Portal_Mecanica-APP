import { FirstAccessForm } from "@/components/organisms/FirstAccessForm";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export default function FirstAccessPage() {
  return (
    <LoginTemplate
      title="Primeiro acesso"
      subtitle="Troque a senha temporária para continuar"
      form={<FirstAccessForm />}
    />
  );
}
