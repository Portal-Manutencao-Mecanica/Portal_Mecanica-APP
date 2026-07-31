import ForgotPasswordPage from "@/components/organisms/ForgotPasswordForm";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export default function ForgotPasswd() {
    return (
        <LoginTemplate
            form={<ForgotPasswordPage />}
            title="Recuperar senha"
            subtitle="Informe seu e-mail para receber o link de redefinição"
        />
    );
}
