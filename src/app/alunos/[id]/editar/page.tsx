"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { getServiceErrorMessage } from "@/services/httpService";
import { studentService } from "@/services/studentService";

const studentSchema = v.object({ name: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe o nome do aluno.")), email: v.pipe(v.string(), v.trim(), v.email("Informe um e-mail válido.")), numberCard: v.pipe(v.string(), v.trim(), v.minLength(1, "Informe o número do crachá.")), enabled: v.boolean() });
const student = { id: 1, name: "Carlos Henrique", email: "carlos@weg.com", numberCard: "123456", enabled: true };

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const [studentName, setStudentName] = useState("");
  const [form, setForm] = useState(student);

  useEffect(() => {
    studentService
      .getById(id)
      .then((loadedStudent) => setStudentName(loadedStudent.name))
      .catch((error) => toast.error(getServiceErrorMessage(error, "Não foi possível carregar o nome do aluno.")));
  }, [id]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const validation = v.safeParse(studentSchema, form); if (!validation.success) { toast.error(validation.issues[0]?.message ?? "Revise os dados do aluno."); return; } toast.info("Os dados foram validados. A API de edição de alunos ainda não está configurada."); }
  return <LayoutDesktop breadcrumbLabels={studentName ? { 1: studentName } : undefined}><div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8"><div className="rounded-xl border border-t-8 border-t-weg-blue border-gray-200 bg-white p-6 shadow-sm md:p-8"><h1 className="text-3xl font-bold">Editar aluno</h1><p className="mt-2 text-gray-500">Atualize as informações do aluno.</p><form onSubmit={handleSubmit} className="mt-8 space-y-6"><div className="grid grid-cols-1 gap-6 md:grid-cols-2"><Input label="Nome *" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><Input label="E-mail *" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><Input label="Número do crachá *" value={form.numberCard} onChange={(event) => setForm({ ...form, numberCard: event.target.value })} /><DropDown label="Status" defaultSelection="Selecione o status" enumData={{ true: "Ativo", false: "Inativo" }} value={String(form.enabled)} onSelect={(value) => setForm({ ...form, enabled: value === "true" })} /></div><div className="flex justify-end gap-3"><Link href={`/alunos/${id}`}><Button type="button" variant="secondary">Cancelar</Button></Link><Button type="submit">Validar alterações</Button></div></form></div></div></LayoutDesktop>;
}
