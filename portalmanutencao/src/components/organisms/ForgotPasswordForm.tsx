import Input from "../atoms/Input"
import Button from "../atoms/Button"

export default function ForgotPasswordPage() {
    return (
        <form className="w-full flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <Input
                    label="Email"
                    placeholder="Insira seu Email"
                />

                <Button type="button" variant="secondary">
                    Enviar código
                </Button>

                <Input
                    label="Código"
                    placeholder="Digite o código recebido"
                />
            </div>

            <Button type="submit" variant="primary">
                Verificar código
            </Button>
        </form>
    )
}