import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Link from "next/link";

export function LoginForm() {
  return (
    <form className="w-full flex flex-col gap-12 md:gap-12">
      <div className="flex flex-col gap-4">
        <Input label="Usúario" placeholder="Insira seu Usuário" />
        <Input label="Senha" type="password" placeholder="Insira sua Senha" />
      </div>


      <Button type="submit" variant="primary">
        Acessar
      </Button>

      <p className="pt-2 text-center text-sm text-gray-700">
        <Link
          href="/login/forgot-password"
          className="font-bold hover:underline"
        >
          Esqueceu sua senha? Clique aqui
        </Link>
      </p>
    </form>
  );
}