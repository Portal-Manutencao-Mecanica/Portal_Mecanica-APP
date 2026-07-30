"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";

const classGroupSchema = v.object({
  acronym: v.pipe(v.string(), v.trim(), v.minLength(2, "Informe a sigla da turma.")),
});

export default function CreateClassGroupPage() {
  const router = useRouter();
  const [acronym, setAcronym] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(classGroupSchema, { acronym });
    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise os dados da turma.");
      return;
    }

    setSaving(true);
    try {
      const classGroup = await classGroupBrowserService.create({ acronym: result.output.acronym, teacherIds: [], studentIds: [] });
      toast.success("Turma cadastrada com sucesso.");
      router.push(`/turmas/${classGroup.id}`);
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível cadastrar a turma."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
        <div><h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Nova turma</h1><p className="mt-1 text-sm text-gray-500">Informe os dados para cadastrar uma nova turma.</p></div>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div><h2 className="border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">Dados da turma</h2><p className="mt-2 text-sm text-gray-500">Os campos com * são obrigatórios.</p></div>
          <Input id="acronym" label="Sigla da turma *" value={acronym} onChange={(event) => setAcronym(event.target.value)} placeholder="Ex.: MEC-2026" required />
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><Link href="/turmas"><Button type="button" variant="secondary">Cancelar</Button></Link><Button type="submit" icon={Save} disabled={saving}>{saving ? "Cadastrando..." : "Cadastrar turma"}</Button></div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
