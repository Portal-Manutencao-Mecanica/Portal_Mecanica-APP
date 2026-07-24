"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";

export default function EditEquipmentPage() {
  const router = useRouter();

  // Mock até integrar com a API
  const [name, setName] = useState("Motor WEG 2CV");
  const [sap, setSap] = useState("123456");
  const [tag, setTag] = useState("MT-001");
  const [patrimony, setPatrimony] = useState("PAT-458963");
  const [images, setImages] = useState<FileList | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log({
      name,
      sap,
      tag,
      patrimony,
      images,
    });

    // Futuramente:
    // await api.put(`/equipment/${id}`, {...})

    router.push("/equipamentos");
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-4xl rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar Equipamento</h1>

          <p className="mt-2 text-gray-500">
            Atualize as informações do equipamento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nome do Equipamento *
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Código SAP
              </label>

              <input
                value={sap}
                onChange={(e) => setSap(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Tag</label>

              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Patrimônio
              </label>

              <input
                value={patrimony}
                onChange={(e) => setPatrimony(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Alterar Imagens
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="w-full rounded-lg border border-dashed p-3"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" onClick={() => router.back()}
            variant="secondary">
              Cancelar
            </Button>

            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
