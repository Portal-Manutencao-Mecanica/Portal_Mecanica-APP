"use client";

import { useState } from "react";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/Input";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { DataRowCard } from "@/components/molecules/DataRowCard";
import { LabelStatus } from "@/types/LabelStatus";

const inconveniences = [
  {
    id: "1",
    numberCard: "5S-0001",
    inconvenience: "Cabos espalhados pelo laboratório",
    place: "Laboratório Mecânica",
    classGroup: "TIIN 2025/1",
    notifiedTeacher: "Carlos Henrique",
    createdAt: "27/07/2026",
    status: "NAO_VISUALIZADA",
  },
  {
    id: "2",
    numberCard: "5S-0002",
    inconvenience: "Ferramentas fora do local",
    place: "Laboratório Elétrica",
    classGroup: "TIIN 2025/2",
    notifiedTeacher: "João Pedro",
    createdAt: "26/07/2026",
    status: "VISUALIZADA",
  },
  {
    id: "3",
    numberCard: "5S-0003",
    inconvenience: "Resíduos no chão",
    place: "Oficina",
    classGroup: "TIIN 2025/1",
    notifiedTeacher: "Maria Souza",
    createdAt: "25/07/2026",
    status: "RESOLVIDA",
  },
];

function getStatus(status: string): {
  text: string;
  status: LabelStatus;
} {
  switch (status) {
    case "NAO_VISUALIZADA":
      return {
        text: "Não Visualizada",
        status: "warning",
      };

    case "VISUALIZADA":
      return {
        text: "Visualizada",
        status: "default",
      };

    case "RESOLVIDA":
      return {
        text: "Resolvida",
        status: "positive",
      };

    default:
      return {
        text: status,
        status: "default",
      };
  }
}

export default function InconveniencePage() {
  const [search, setSearch] = useState("");

  const filteredInconveniences = inconveniences.filter(
    (item) =>
      item.numberCard.toLowerCase().includes(search.toLowerCase()) ||
      item.inconvenience.toLowerCase().includes(search.toLowerCase()) ||
      item.place.toLowerCase().includes(search.toLowerCase()) ||
      item.classGroup.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <LayoutDesktop>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Incoveniência 5S</h1>

            <p className="text-gray-500">
              Gerencie todas as ocorrências registradas.
            </p>
          </div>

          <Link href="/ocorrencias/nova">
            <Button>Nova Ocorrência</Button>
          </Link>
        </div>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar ocorrência..."
        />

        <div className="space-y-4">
          {filteredInconveniences.map((item) => {
            const label = getStatus(item.status);

            return (
              <DataRowCard
                key={item.id}
                actions={
                  <Link href={`/ocorrencias/${item.id}`}>
                    <Button>Ver Detalhes</Button>
                  </Link>
                }
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{item.numberCard}</h2>

                    <LabelWithCircle status={label.status} text={label.text} />
                  </div>

                  <p className="font-medium">{item.inconvenience}</p>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Local:</strong> {item.place}
                    </p>

                    <p>
                      <strong>Professor:</strong> {item.notifiedTeacher}
                    </p>

                    <p>
                      <strong>Turma:</strong> {item.classGroup}
                    </p>

                    <p>
                      <strong>Data:</strong> {item.createdAt}
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
