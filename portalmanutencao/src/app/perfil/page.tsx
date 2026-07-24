"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";

export default function ProfilePage() {
  const router = useRouter();

  const user = {
    name: "Junior Gabriel",
    email: "junior@weg.net",
    registration: "202500123",
    role: "Professor",
    permission: "Administrador",
  };

  function handleLogout() {
    // Futuramente:
    // remover token
    // localStorage.removeItem("token");
    // cookies.delete("token");

    router.push("/login");
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-4xl rounded-xl border bg-white p-8 shadow-sm">

        <h1 className="mb-8 text-3xl font-bold">
          Meu Perfil
        </h1>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          <div className="flex flex-col items-center">
            <div className="relative h-52 w-52 overflow-hidden rounded-full border">
              <Image
                src={user.image}
                alt={user.name}
                fill
                className="object-cover"
              />
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
              <p className="text-sm text-gray-500">Matrícula</p>
              <p className="text-lg">{user.registration}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Cargo</p>
              <p className="text-lg">{user.role}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Permissão</p>
              <p className="text-lg">{user.permission}</p>
            </div>

            <div className="flex gap-4 pt-4">

              <Button>
                Editar Perfil
              </Button>

              <Button
                variant="danger"
                onClick={handleLogout}
              >
                Sair da Conta
              </Button>

            </div>

          </div>

        </div>

      </div>
    </LayoutDesktop>
  );
}