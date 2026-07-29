"use client";

import { FormEvent, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { machineService } from "@/services/machineService";
import { getServiceErrorMessage } from "@/services/httpService";

const machineSchema = v.object({ patrimony: v.pipe(v.string(), v.trim(), v.nonEmpty("Informe o numero de patrimonio.")), name: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe o nome da maquina.")), condition: v.picklist(["ATIVA", "MANUTENCAO", "INATIVA"], "Selecione a condicao."), tag: v.optional(v.string()) });
const emptyMachine: { patrimony: string; name: string; condition: "ATIVA" | "MANUTENCAO" | "INATIVA"; tag: string } = { patrimony: "", name: "", condition: "ATIVA", tag: "" };
interface PageProps { params: Promise<{ id: string }>; }

export default function EditMachinePage({ params }: PageProps) {
  const { id } = use(params); const router = useRouter(); const [form, setForm] = useState(emptyMachine); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  useEffect(() => { async function loadMachine() { try { const machine = await machineService.getById(id); setForm({ patrimony: machine.patrimony, name: machine.name, condition: machine.condition, tag: machine.tag ?? "" }); } catch (error) { toast.error(getServiceErrorMessage(error, "Nao foi possivel carregar a maquina.")); } finally { setLoading(false); } } void loadMachine(); }, [id]);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const validation = v.safeParse(machineSchema, form); if (!validation.success) { toast.error(validation.issues[0]?.message ?? "Revise os dados da maquina."); return; } setSaving(true); try { await machineService.update(id, { ...validation.output, tag: validation.output.tag ?? "" }); toast.success("Maquina atualizada com sucesso."); router.push(`/maquinas/${id}`); router.refresh(); } catch (error) { toast.error(getServiceErrorMessage(error, "Nao foi possivel atualizar a maquina.")); } finally { setSaving(false); } }
  return <LayoutDesktop><div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8"><div><h1 className="text-2xl font-bold">Editar maquina</h1><p className="text-gray-500">Atualize os dados da maquina e salve as alteracoes.</p></div>{loading ? <p className="text-sm text-gray-500">Carregando maquina...</p> : <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><div className="grid grid-cols-1 gap-6 md:grid-cols-2"><Input label="Numero de patrimonio *" value={form.patrimony} onChange={(event) => setForm({ ...form, patrimony: event.target.value })} /><Input label="Nome da maquina *" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><label className="text-sm font-medium">Condicao *<select value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value as typeof form.condition })} className="mt-1 w-full rounded-lg border p-3"><option value="ATIVA">Ativa</option><option value="MANUTENCAO">Em manutencao</option><option value="INATIVA">Inativa</option></select></label><Input label="Tag" value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} /></div><div className="flex justify-end gap-3 border-t pt-4"><Link href={`/maquinas/${id}`}><Button type="button" variant="secondary">Cancelar</Button></Link><Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alteracoes"}</Button></div></form>}</div></LayoutDesktop>;
}