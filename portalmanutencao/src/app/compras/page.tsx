"use client";

import { useState } from "react";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/Input";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { DataRowCard } from "@/components/molecules/DataRowCard";
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

        <div className="space-y-4">
          {filteredBuys.map((buy) => {
            const label = getStatus(buy.status);

            return (
              <DataRowCard
                key={buy.id}
                actions={
                  <Link href={`/compras/${buy.id}`}>
                    <Button>Ver Detalhes</Button>
                  </Link>
                }
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{buy.numberCard}</h2>

                    <LabelWithCircle status={label.status} text={label.text} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Professor:</strong> {buy.createdBy}
                    </p>

                    <p>
                      <strong>Turma:</strong> {buy.classGroup}
                    </p>

                    <p>
                      <strong>Data:</strong> {buy.createdAt}
                    </p>

                    <p>
                      <strong>Itens:</strong> {buy.totalItems}
                    </p>
                  </div>
                </div>
              </DataRowCard>
            );
          })}
        </div>
      </div>
    </LayoutDesktop>
  );
}
