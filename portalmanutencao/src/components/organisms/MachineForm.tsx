"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { machineService } from "@/services/machineService";
import { getServiceErrorMessage } from "@/services/httpService";

const machineSchema = v.object({
  patrimony: v.pipe(v.string(), v.trim(), v.nonEmpty("Informe o numero de patrimonio.")),
  name: v.pipe(v.string(), v.trim(), v.minLength(3, "O nome da maquina deve ter pelo menos 3 caracteres.")),
  placeId: v.pipe(v.string(), v.trim(), v.uuid("Informe um identificador de local valido.")),
  condition: v.picklist(["ATIVA", "MANUTENCAO", "INATIVA"], "Selecione a condicao."),
  tag: v.optional(v.string()),
});

type MachineFormData = v.InferInput<typeof machineSchema>;

export default function MachineForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MachineFormData>({
    resolver: valibotResolver(machineSchema),
    defaultValues: { patrimony: "", name: "", placeId: "", condition: "ATIVA", tag: "" },
  });

  async function onSubmit(data: MachineFormData) {
    try {
      const machine = await machineService.create({ ...data, tag: data.tag?.trim() ?? "" });
      toast.success("Maquina cadastrada com sucesso.");
      router.push(`/maquinas/${machine.id}`);
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Nao foi possivel cadastrar a maquina."));
    }
  }

  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="border-b pb-2 text-lg font-semibold text-gray-800">Informacoes da maquina</h2><div className="grid grid-cols-1 gap-6 md:grid-cols-2"><Field label="Numero de patrimonio *" error={errors.patrimony?.message}><Input placeholder="Ex.: 100004" {...register("patrimony")} /></Field><Field label="Nome da maquina *" error={errors.name?.message}><Input placeholder="Ex.: Torno mecanico" {...register("name")} /></Field><Field label="Identificador do local *" error={errors.placeId?.message}><Input placeholder="UUID do local cadastrado" {...register("placeId")} /></Field><Field label="Condicao *" error={errors.condition?.message}><select className="w-full rounded-lg border border-gray-300 p-3" {...register("condition")}><option value="ATIVA">Ativa</option><option value="MANUTENCAO">Em manutencao</option><option value="INATIVA">Inativa</option></select></Field><Field label="Tag ou categoria" error={errors.tag?.message}><Input placeholder="Ex.: CNC, 3D, FRESA" {...register("tag")} /></Field></div><div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4"><Link href="/maquinas"><Button type="button" variant="secondary">Cancelar</Button></Link><Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? "Cadastrando..." : "Cadastrar maquina"}</Button></div></form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700">{label}{children}{error && <span className="mt-1 block text-xs text-weg-negative">{error}</span>}</label>;
}