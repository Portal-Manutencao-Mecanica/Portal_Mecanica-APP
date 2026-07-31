"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import UserPicture from "@/components/molecules/UserPicture";
import { useAuth } from "@/hooks/useAuth";
import { getServiceErrorMessage } from "@/services/httpService";

const ROLE_LABELS = {
  ADMIN: "Administrador",
  COORDENADOR: "Coordenador",
  PROFESSOR: "Professor",
  ALUNO: "Aluno",
} as const;

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Sessão encerrada com sucesso.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível encerrar a sessão."),
      );
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (!user) {
    return (
      <LayoutDesktop>
        <div />
      </LayoutDesktop>
    );
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-3xl font-bold">Meu Perfil</h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <UserPicture name={user.name} size={208} />
          </div>

          <div className="space-y-6 md:col-span-2">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">E-mail</p>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Usuário</p>
              <p className="text-lg">{user.username}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Perfil</p>
              <p className="text-lg">{ROLE_LABELS[user.role]}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Organização</p>
              <p className="text-lg">
                {user.organization?.name ?? "Não informada"}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="danger"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Saindo..." : "Sair da Conta"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LayoutDesktop>
  );
}
