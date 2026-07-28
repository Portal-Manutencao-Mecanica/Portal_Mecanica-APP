"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/Input";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { DataRowCard } from "@/components/molecules/DataRowCard";
import { LabelStatus } from "../../props/LabelProps";
import type { Buy } from "@/lib/api/types";
import { buyService } from "@/services/buyService";

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
  const [buys, setBuys] = useState<Buy[]>([]);

  useEffect(() => {
    buyService.list().then(setBuys).catch(() => setBuys([]));
  }, []);

  const filteredBuys = buys.filter(
    (buy) =>
      buy.id.toLowerCase().includes(search.toLowerCase()) ||
      buy.createdByName.toLowerCase().includes(search.toLowerCase()) ||
      buy.classGroupAcronym.toLowerCase().includes(search.toLowerCase()),
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
                    <h2 className="text-lg font-semibold">{buy.id}</h2>

                    <LabelWithCircle status={label.status} text={label.text} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Professor:</strong> {buy.createdByName}
                    </p>

                    <p>
                      <strong>Turma:</strong> {buy.classGroupAcronym}
                    </p>

                    <p>
                      <strong>Data:</strong>{" "}
                      {new Intl.DateTimeFormat("pt-BR").format(new Date(buy.createdAt))}
                    </p>

                    <p>
                      <strong>Itens:</strong> {buy.items.length}
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
