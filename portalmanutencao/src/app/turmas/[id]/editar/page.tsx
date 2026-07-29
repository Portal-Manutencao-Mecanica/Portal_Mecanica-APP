"use client";

import { FormEvent, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

interface Teacher { id: string; name: string; email: string; }
interface ClassGroup { id: number; acronym: string; teachers: Teacher[]; }
interface PageProps { params: Promise<{ id: string }>; }

const classGroupSchema = v.object({
  acronym: v.pipe(v.string(), v.trim(), v.minLength(2, "Informe a sigla da turma.")),
  teachers: v.optional(v.string()),
});

export default function EditClassPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [acronym, setAcronym] = useState("");
  const [teachers, setTeachers] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadClass() {
      try {
        const response = await fetch(`http://localhost:8080/api/turma/${id}`);
        if (!response.ok) throw new Error("Não foi possível carregar os dados da turma.");
        const classGroup: ClassGroup = await response.json();
        setAcronym(classGroup.acronym ?? "");
        setTeachers(classGroup.teachers?.map((teacher) => teacher.name).join(", ") ?? "");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Não foi possível carregar a turma.");
      } finally {
        setLoading(false);
      }
    }
    loadClass();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(classGroupSchema, { acronym, teachers });
    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise os dados da turma.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8080/api/turma/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acronym: result.output.acronym, teachers: (result.output.teachers ?? "").split(",").map((name) => name.trim()).filter(Boolean) }),
      });
      if (!response.ok) throw new Error("Não foi possível salvar as alterações da turma.");
      toast.success("Turma atualizada com sucesso.");
      router.push(`/turmas/${id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a turma. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return <LayoutDesktop><div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8"><div className="flex items-center gap-3"><Link href={`/turmas/${id}`} aria-label="Voltar para a turma"><Button type="button" variant="secondary" icon={ArrowLeft}>Voltar</Button></Link><div><h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Editar turma</h1><p className="mt-1 text-sm text-gray-500">Atualize as informações da turma e salve as alterações.</p></div></div>{loading ? <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">Carregando dados da turma...</div> : <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><div><h2 className="border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">Dados da turma</h2><p className="mt-2 text-sm text-gray-500">Os campos com * são obrigatórios.</p></div><div className="space-y-5"><Input id="acronym" label="Sigla da turma *" value={acronym} onChange={(event) => setAcronym(event.target.value)} placeholder="Ex.: MEC-2026" required /><Input id="teachers" label="Professores" value={teachers} onChange={(event) => setTeachers(event.target.value)} placeholder="Separe os nomes por vírgula" /><p className="-mt-3 text-xs text-gray-500">Exemplo: Ana Souza, Carlos Lima</p></div><div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><Link href={`/turmas/${id}`}><Button type="button" variant="secondary">Cancelar</Button></Link><Button type="submit" icon={Save} disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</Button></div></form>}</div></LayoutDesktop>;
}