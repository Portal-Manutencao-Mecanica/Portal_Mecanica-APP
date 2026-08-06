"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { getServiceErrorMessage } from "@/services/httpService";
import { studentService } from "@/services/studentService";
import { userService } from "@/services/userService";

const studentSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(3, "Informe o nome do aluno."),
    v.maxLength(150, "O nome deve possuir no máximo 150 caracteres."),
  ),
  email: v.pipe(v.string(), v.trim(), v.email("Informe um e-mail válido.")),
  numberCard: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Informe o número do crachá."),
    v.maxLength(100, "O número do crachá deve possuir no máximo 100 caracteres."),
  ),
  enabled: v.boolean(),
});

type StudentForm = v.InferOutput<typeof studentSchema>;

const emptyForm: StudentForm = {
  name: "",
  email: "",
  numberCard: "",
  enabled: true,
};

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [initialEnabled, setInitialEnabled] = useState(true);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    studentService
      .getById(id)
      .then((student) => {
        setStudentName(student.name);
        setInitialEnabled(student.enabled);
        setForm({
          name: student.name,
          email: student.email,
          numberCard: student.numberCard,
          enabled: student.enabled,
        });
      })
      .catch((error) =>
        toast.error(
          getServiceErrorMessage(error, "Não foi possível carregar o aluno."),
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = v.safeParse(studentSchema, form);
    if (!validation.success) {
      toast.error(validation.issues[0]?.message ?? "Revise os dados do aluno.");
      return;
    }

    setSubmitting(true);
    try {
      await userService.update(id, {
        name: validation.output.name,
        email: validation.output.email,
        numberCard: validation.output.numberCard,
      });
      if (validation.output.enabled !== initialEnabled) {
        if (validation.output.enabled) {
          await userService.reactivate(id);
        } else {
          await userService.deactivate(id);
        }
      }
      toast.success("Aluno atualizado com sucesso.");
      router.push(`/alunos/${id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível atualizar o aluno."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <LayoutDesktop>
        <p className="p-8 text-center text-gray-500">Carregando aluno...</p>
      </LayoutDesktop>
    );
  }

  return (
    <LayoutDesktop
      breadcrumbLabels={studentName ? { 1: studentName } : undefined}
    >
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
        <div className="rounded-xl border border-t-8 border-gray-200 border-t-weg-blue bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-bold">Editar aluno</h1>
          <p className="mt-2 text-gray-500">
            Atualize as informações do aluno.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Nome *"
                maxLength={150}
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
              <Input
                label="E-mail *"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
              <Input
                label="Número do crachá *"
                maxLength={100}
                value={form.numberCard}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    numberCard: event.target.value,
                  }))
                }
              />
              <DropDown
                label="Status"
                defaultSelection="Selecione o status"
                enumData={{ true: "Ativo", false: "Inativo" }}
                value={String(form.enabled)}
                onSelect={(value) =>
                  setForm((current) => ({
                    ...current,
                    enabled: value === "true",
                  }))
                }
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button href={`/alunos/${id}`} variant="secondary">
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </LayoutDesktop>
  );
}
