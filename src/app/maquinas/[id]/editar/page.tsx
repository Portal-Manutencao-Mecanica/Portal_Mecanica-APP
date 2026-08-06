"use client";

import { FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import UploadedFile64 from "@/components/molecules/UploadedFile64";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";

const machineSchema = v.object({
  patrimony: v.pipe(v.string(), v.trim(), v.nonEmpty("Informe o número de patrimônio.")),
  name: v.pipe(v.string(), v.trim(), v.minLength(3, "Informe o nome da máquina.")),
  condition: v.picklist(["CONFORME", "NAO_CONFORME"], "Selecione a condição."),
  tag: v.optional(v.string()),
});

const emptyMachine: {
  patrimony: string;
  name: string;
  condition: "CONFORME" | "NAO_CONFORME";
  tag: string;
} = { patrimony: "", name: "", condition: "CONFORME", tag: "" };

export default function EditMachinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState(emptyMachine);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    machineService
      .getById(id)
      .then((machine) => {
        if (!active) return;
        setForm({
          patrimony: machine.patrimony,
          name: machine.name,
          condition: machine.condition,
          tag: machine.tag ?? "",
        });
        setImages(machine.image ? [machine.image] : []);
      })
      .catch((loadError) => {
        if (!active) return;
        const message = getServiceErrorMessage(
          loadError,
          "Não foi possível carregar a máquina.",
        );
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const validation = v.safeParse(machineSchema, form);
    if (!validation.success) {
      toast.error(validation.issues[0]?.message ?? "Revise os dados da máquina.");
      return;
    }

    setSaving(true);
    try {
      await machineService.update(id, {
        ...validation.output,
        tag: validation.output.tag ?? "",
        image: images[0] ?? "",
      });
      toast.success("Máquina atualizada com sucesso.");
      router.push(`/maquinas/${id}`);
      router.refresh();
    } catch (saveError) {
      toast.error(
        getServiceErrorMessage(saveError, "Não foi possível atualizar a máquina."),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <LayoutDesktop breadcrumbLabels={form.name ? { 1: form.name } : undefined}>
      <section className="space-y-6">
        <PageHeader
          title="Editar máquina"
          description="Atualize os dados e a imagem da máquina."
        />
        {loading ? (
          <PageFeedback message="Carregando máquina..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                label="Número de patrimônio *"
                value={form.patrimony}
                onChange={(event) => setForm({ ...form, patrimony: event.target.value })}
                required
              />
              <Input
                label="Nome da máquina *"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <DropDown
                label="Condição *"
                defaultSelection="Selecione uma condição"
                enumData={{ CONFORME: "Conforme", NAO_CONFORME: "Não conforme" }}
                value={form.condition}
                onSelect={(value) => setForm({
                  ...form,
                  condition: value as typeof form.condition,
                })}
              />
              <Input
                label="Tag"
                value={form.tag}
                onChange={(event) => setForm({ ...form, tag: event.target.value })}
              />
            </div>

            <section className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Imagem da máquina</h2>
                <p className="text-sm text-gray-500">Envie uma imagem de até 5 MB.</p>
              </div>
              <UploadedFile64
                id="machine-image"
                value={images}
                onChange={setImages}
                maxFiles={1}
                maxFileSizeBytes={5 * 1024 * 1024}
                disabled={saving}
              />
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button href={`/maquinas/${id}`} variant="secondary">Cancelar</Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        )}
      </section>
    </LayoutDesktop>
  );
}
