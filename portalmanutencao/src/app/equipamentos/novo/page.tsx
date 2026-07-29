"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { equipmentService } from "@/services/equipmentService";
import { getServiceErrorMessage } from "@/services/httpService";

export default function NewEquipmentPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sap, setSap] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await equipmentService.create({
        name,
        sap,
        unitPrice: Number(unitPrice),
        availableQuantity: Number(availableQuantity),
      });
      router.push("/equipamentos");
      router.refresh();
    } catch (requestError) {
      setError(getServiceErrorMessage(requestError, "Falha ao cadastrar equipamento."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Novo Equipamento</h1>

          <p className="mt-2 text-gray-500">
            Preencha as informações para cadastrar um novo equipamento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Input
                label="Nome do Equipamento *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Motor WEG 2CV"
                required
              />
            </div>

            <div>
              <Input
                label="Código SAP"
                type="text"
                value={sap}
                onChange={(e) => setSap(e.target.value)}
                placeholder="Ex.: 123456"
              />
            </div>

            <div>
              <Input
                label="Valor unitário *"
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Input
                label="Quantidade disponível *"
                type="number"
                min="0"
                step="1"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Equipamento"}
            </Button>
          </div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
