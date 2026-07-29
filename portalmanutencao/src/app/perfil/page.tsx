"use client";

import { useRouter } from "next/navigation";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import UserPicture from "../../components/molecules/UserPicture";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  async function handleLogout() {
    await authService.logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-3xl font-bold">Meu Perfil</h1>

        {isLoading && <p className="text-gray-500">Carregando perfil...</p>}

        {!isLoading && !user && (
          <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
            Sua sessão expirou. Entre novamente para acessar o perfil.
          </div>
        )}

        {user && <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <UserPicture name={user.name} size={208} />
            </div>
          </div>

          <div className="space-y-6 md:col-span-2">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Usuário</p>
              <p className="text-lg">{user.username}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Perfil</p>
              <p className="text-lg">{user.role}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Organização</p>
              <p className="text-lg">{user.organization?.name ?? "Não informada"}</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button>Editar Perfil</Button>

              <Button variant="danger" onClick={handleLogout}>
                Sair da Conta
              </Button>
            </div>
          </div>
        </div>}
      </div>
    </LayoutDesktop>
  );
}
