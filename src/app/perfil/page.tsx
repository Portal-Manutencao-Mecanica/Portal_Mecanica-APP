"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Shield,
  Building2,
  LogOut,
} from "lucide-react";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/hooks/useAuth";

export default function PerfilPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const usuario = {
    nome: "Professor de Teste",
    email: "professor@teste.local",
    username: "professor.teste",
    perfil: "Professor",
    organizacao: "Organização de Teste",
    iniciais: "PT",
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAlterarSenha = () => {
    console.log("Abrindo modal/tela de alterar senha...");
  };

  return (
    <LayoutDesktop>
      <div className="flex flex-col gap-6 pb-8 max-w-5xl mx-auto w-full">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
          <p className="text-sm text-gray-500">
            Gerencie suas informações pessoais e credenciais de acesso ao portal.
          </p>
        </div>

        {/* CONTAINER DO PERFIL */}
        <div className="flex flex-col gap-6">
          
          {/* PRIMEIRO BLOCO: FOTO + INFORMAÇÕES PESSOAIS (Lado a lado com a mesma altura) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* CARTÃO DA FOTO / RESUMO (Altura idêntica ao card do lado) */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center gap-3 h-full">
              <div className="w-24 h-24 rounded-full bg-weg-blue/10 border-4 border-white shadow-md flex items-center justify-center text-weg-blue text-2xl font-bold select-none">
                {usuario.iniciais}
              </div>

              <h2 className="text-lg font-bold text-gray-800">
                {usuario.nome}
              </h2>
            </div>

            {/* CARD 1: INFORMAÇÕES PESSOAIS */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="w-5 h-5 text-weg-blue" />
                <h3 className="font-bold text-gray-800 text-base">
                  Informações Pessoais
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NOME */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <div className="px-3.5 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm font-medium text-gray-800">
                    {usuario.nome}
                  </div>
                </div>

                {/* USUÁRIO */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Nome de Usuário
                  </label>
                  <div className="px-3.5 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm font-mono text-gray-800">
                    @{usuario.username}
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    E-mail Corporativo
                  </label>
                  <div className="px-3.5 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm font-medium text-gray-800">
                    {usuario.email}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SEGUNDO BLOCO: CARD VÍNCULO E SEGURANÇA (Abaixo de ambos) */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Shield className="w-5 h-5 text-weg-blue" />
              <h3 className="font-bold text-gray-800 text-base">
                Vínculo e Acesso
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PERFIL / PERMISSÃO */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  Nível de Acesso
                </label>
                <div className="px-3.5 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm font-medium text-gray-800">
                  {usuario.perfil}
                </div>
              </div>

              {/* ORGANIZAÇÃO */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  Organização
                </label>
                <div className="px-3.5 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-sm font-medium text-gray-800">
                  {usuario.organizacao}
                </div>
              </div>
            </div>

            {/* RODAPÉ DO CARD DE ACESSO */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-50">
              <Button
                onClick={handleAlterarSenha}
                className="text-xs font-semibold w-full sm:w-auto"
              >
                <span>Alterar minha senha</span>
              </Button>

              <Button
                variant="danger"
                onClick={handleLogout}
                icon={LogOut}
                disabled={isLoggingOut}
                className="text-xs font-semibold w-full sm:w-auto"
              >
                <span>{isLoggingOut ? "Saindo..." : "Sair da Conta"}</span>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </LayoutDesktop>
  );
}
