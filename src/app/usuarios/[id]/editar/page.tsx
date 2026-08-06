"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import UserForm, { type UserFormValues } from "@/components/organisms/UserForm";
import UserAdministrationActions from "@/components/organisms/UserAdministrationActions";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { ManagedUser } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { userService } from "@/services/userService";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [managedUser, setManagedUser] = useState<ManagedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    userService.getById(id)
      .then((result) => {
        if (active) setManagedUser(result);
      })
      .catch((loadError) => {
        if (active) {
          setError(getServiceErrorMessage(loadError, "Não foi possível carregar o usuário."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function updateUser(values: UserFormValues) {
    await userService.update(id, {
      name: values.name,
      email: values.email,
      numberCard: values.numberCard,
      organizationId: values.organizationId,
    });
    toast.success("Usuário atualizado com sucesso.");
    router.push("/usuarios");
    router.refresh();
  }

  return (
    <LayoutDesktop breadcrumbLabels={managedUser ? { 1: managedUser.name } : undefined}>
      <section className="space-y-6">
        <PageHeader
          title="Editar usuário"
          description="Atualize as informações cadastrais do usuário."
        />
        {loading ? (
          <PageFeedback message="Carregando usuário..." />
        ) : managedUser ? (
          <>
            <UserForm
              mode="edit"
              initialValues={managedUser}
              cancelHref="/usuarios"
              onSubmit={updateUser}
            />
            <UserAdministrationActions
              managedUser={managedUser}
              onChange={setManagedUser}
            />
          </>
        ) : (
          <PageFeedback variant="error" message={error || "Usuário não encontrado."} />
        )}
      </section>
    </LayoutDesktop>
  );
}
