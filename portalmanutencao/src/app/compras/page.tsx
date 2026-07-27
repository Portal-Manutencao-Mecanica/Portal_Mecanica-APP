"use client";

import { useState } from "react";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/Input";

const buys = [
  {
    id: "1",
    numberCard: "COMP-0001",
    createdBy: "João Silva",
    classGroup: "TIIN 2025/1",
    createdAt: "24/07/2026",
    status: "Não visualizado",
    totalItems: 4,
  },
  {
    id: "2",
    numberCard: "COMP-0002",
    createdBy: "Maria Souza",
    classGroup: "TIIN 2025/2",
    createdAt: "23/07/2026",
    status: "Visualizado",
    totalItems: 2,
  },
];

export default function BuyPage() {
  const [search, setSearch] = useState("");

  const filteredBuys = buys.filter(
    (buy) =>
      buy.createdBy.toLowerCase().includes(search.toLowerCase()) ||
      buy.numberCard.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <LayoutDesktop>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Solicitações de Compra</h1>

            <p className="text-gray-500">
              Gerencie todas as solicitações cadastradas.
            </p>
          </div>

          <Link href="/compras/nova">
            <Button>Nova Solicitação</Button>
          </Link>
        </div>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar solicitação..."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredBuys.map((buy) => (
            <div
              key={buy.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{buy.numberCard}</h2>

                <p>
                  <strong>Professor:</strong> {buy.createdBy}
                </p>

                <p>
                  <strong>Turma:</strong> {buy.classGroup}
                </p>

                <p>
                  <strong>Criado em:</strong> {buy.createdAt}
                </p>

                <p>
                  <strong>Itens:</strong> {buy.totalItems}
                </p>

                <p>
                  <strong>Status:</strong> {buy.status}
                </p>
              </div>

              <div className="mt-6">
                <Link href={`/compras/${buy.id}`}>
                  <Button>Ver detalhes</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutDesktop>
  );
}
