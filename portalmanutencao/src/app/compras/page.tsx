"use client";

import { useState } from "react";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/Input";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { LabelStatus } from "../../props/LabelProps";

const buys = [
  {
    id: "1",
    numberCard: "COMP-0001",
    createdBy: "João Silva",
    classGroup: "TIIN 2025/1",
    createdAt: "24/07/2026",
    totalItems: 4,
    status: "NAO_VISUALIZADO",
  },
  {
    id: "2",
    numberCard: "COMP-0002",
    createdBy: "Maria Souza",
    classGroup: "TIIN 2025/2",
    createdAt: "23/07/2026",
    totalItems: 2,
    status: "APROVADO",
  },
  {
    id: "3",
    numberCard: "COMP-0003",
    createdBy: "Carlos Henrique",
    classGroup: "TIIN 2025/1",
    createdAt: "22/07/2026",
    totalItems: 6,
    status: "REPROVADO",
  },
];


function getStatus(status: string): {
  text: string;
  status: LabelStatus;
} {
  switch (status) {
    case "NAO_VISUALIZADO":
      return {
        text: "Não Visualizado",
        status: "warning",
      };

    case "VISUALIZADO":
      return {
        text: "Visualizado",
        status: "default",
      };

    case "APROVADO":
      return {
        text: "Aprovado",
        status: "positive",
      };

    case "REPROVADO":
      return {
        text: "Reprovado",
        status: "negative",
      };

    default:
      return {
        text: status,
        status: "default",
      };
  }
}

export default function BuyPage() {
  const [search, setSearch] = useState("");

  const filteredBuys = buys.filter(
    (buy) =>
      buy.numberCard.toLowerCase().includes(search.toLowerCase()) ||
      buy.createdBy.toLowerCase().includes(search.toLowerCase()) ||
      buy.classGroup.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <LayoutDesktop>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Solicitações de Compra</h1>

            <p className="text-gray-500">
              Gerencie as solicitações enviadas pelos professores.
            </p>
          </div>
        </div>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar solicitação..."
        />

        <div className="grid grid-cols-1 gap-6">
          {filteredBuys.map((buy) => {
            const label = getStatus(buy.status);

            return (
              <div
                key={buy.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{buy.numberCard}</h2>

                    <p className="mt-2 text-gray-600">
                      <strong>Professor:</strong> {buy.createdBy}
                    </p>

                    <p className="text-gray-600">
                      <strong>Turma:</strong> {buy.classGroup}
                    </p>

                    <p className="text-gray-600">
                      <strong>Data:</strong> {buy.createdAt}
                    </p>

                    <p className="text-gray-600">
                      <strong>Itens:</strong> {buy.totalItems}
                    </p>
                  </div>

                  <LabelWithCircle status={label.status} text={label.text} />
                </div>

                <div className="mt-6 flex justify-end">
                  <Link href={`/compras/${buy.id}`}>
                    <Button>Ver Detalhes</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </LayoutDesktop>
  );
}
