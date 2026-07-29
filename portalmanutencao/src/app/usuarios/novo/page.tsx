"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type { CreateUserRequest } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { userService } from "@/services/userService";

const initialForm: CreateUserRequest = { name: "", username: "", email: "", role: "ALUNO", organizationId: "" };

export default function NewUserPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canManageUsers = user?.role === "ADMIN" || user?.role === "COORDENADOR";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManageUsers) return;
    setIsSubmitting(true);
    try {
      const createdUser = await userService.create({ ...form, organizationId: form.organizationId || undefined });
      toast.success(`Usuário ${createdUser.name} criado com sucesso.`);
      setForm(initialForm);
    } catch (requestError) {
      toast.error(getServiceErrorMessage(requestError, "Não foi possível criar o usuário."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return <LayoutDesktop><main className="ui-page max-w-3xl"><h1 className="text-3xl font-bold text-gray-800">Criar usuário</h1><p className="mt-2 text-gray-500">Administradores e coordenadores podem criar novas contas.</p>{!canManageUsers ? <p role="alert" className="ui-surface mt-6 p-5 text-amber-800">Você não tem permissão para criar usuários.</p> : <form onSubmit={handleSubmit} className="ui-surface mt-6 grid gap-4 p-6 md:grid-cols-2"><Input label="Nome *" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><Input label="Nome de usuário *" required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /><Input label="E-mail *" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><Input label="ID da organização" value={form.organizationId} onChange={(event) => setForm({ ...form, organizationId: event.target.value })} /><div><label htmlFor="role" className="ui-field-label">Perfil *</label><select id="role" className="ui-control mt-1.5" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as CreateUserRequest["role"] })}><option value="ALUNO">Aluno</option><option value="PROFESSOR">Professor</option><option value="COORDENADOR">Coordenador</option><option value="ADMIN">Administrador</option></select></div><div className="md:col-span-2"><div className="flex justify-end"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Criando..." : "Criar usuário"}</Button></div></div></form>}</main></LayoutDesktop>;
}