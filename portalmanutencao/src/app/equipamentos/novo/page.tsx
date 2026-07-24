"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";

export default function NewEquipmentPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sap, setSap] = useState("");
  const [tag, setTag] = useState("");
  const [patrimony, setPatrimony] = useState("");
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

    // Futuramente chamar a API

    router.push("/equipamentos");
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-4xl rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Novo Equipamento</h1>

          <p className="mt-2 text-gray-500">
            Preencha as informações para cadastrar um novo equipamento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nome do Equipamento *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Motor WEG 2CV"
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Código SAP
              </label>

              <input
                type="text"
                value={sap}
                onChange={(e) => setSap(e.target.value)}
                placeholder="Ex.: 123456"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Tag</label>

              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Ex.: TAG-001"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Patrimônio
              </label>

              <input
                type="text"
                value={patrimony}
                onChange={(e) => setPatrimony(e.target.value)}
                placeholder="Ex.: PAT-000123"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Imagens</label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="w-full rounded-lg border border-dashed border-gray-300 p-3"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
            >
              <Button variant="secondary">Cancelar</Button>
            </button>

            <button type="submit">
              <Button>Salvar Equipamento</Button>
            </button>
          </div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
