"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PageHeader from "@/components/molecules/PageHeader";
import UserForm, { type UserFormValues } from "@/components/organisms/UserForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { CreateUserRequest } from "@/lib/api/types";
import { userService } from "@/services/userService";

export default function CreateUserPage() {
  const router = useRouter();

  async function createUser(values: UserFormValues) {
    const common = {
      name: values.name,
      email: values.email,
      numberCard: values.numberCard,
      organizationId: values.organizationId,
    };
    let payload: CreateUserRequest;

    if (values.role === "ALUNO") {
      payload = { ...common, role: values.role, studentData: { classGroupIds: values.classGroupIds } };
    } else if (values.role === "PROFESSOR") {
      payload = { ...common, role: values.role, teacherData: { classGroupIds: values.classGroupIds } };
    } else {
      payload = { ...common, role: values.role };
    }

    await userService.create(payload);
    toast.success("Usuário cadastrado com sucesso.");
    router.push("/usuarios");
    router.refresh();
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Novo usuário"
          description="Preencha os dados para cadastrar um único usuário."
        />
        <UserForm
          mode="create"
          cancelHref="/usuarios"
          onSubmit={createUser}
        />
      </section>
    </LayoutDesktop>
  );
}
