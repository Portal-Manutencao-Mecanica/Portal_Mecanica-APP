import ForgotPasswordPage from "@/components/organisms/ForgotPasswordForm";
import { LoginTemplate } from "@/components/templates/LoginTemplate";

export default function ForgotPasswd() {
    return (
        <LoginTemplate
            form={<ForgotPasswordPage />}
        />
    );
}