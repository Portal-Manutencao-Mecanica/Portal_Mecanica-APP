
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button"; 

export function LoginForm() {
  return (
    <form className="w-full flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col gap-4">
            <Input label="Email" type="email" placeholder="seumelhor@email.com" />
            <Input label="Senha" type="password" placeholder="Insira sua Senha" />
        </div>
        
       
            <Button type="submit" variant="primary">
                 Acessar
            </Button>
         
      

        <p className="pt-2 text-center text-sm text-gray-700">
          Esqueceu sua Senha? <span className="font-bold cursor-pointer">Clique Aqui</span>
        </p>
    </form>
  );
}