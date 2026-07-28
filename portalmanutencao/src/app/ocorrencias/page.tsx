"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { DataRowCard } from "@/components/molecules/DataRowCard";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { maintenanceRequests } from "@/data/maintenanceRequests";
import { MaintenanceRequestStatus } from "@/types/MaintenanceRequest";
import { LabelStatus } from "@/types/LabelStatus";

const statuses: Record<MaintenanceRequestStatus, { label: string; color: LabelStatus }> = {
  AGUARDANDO_APROVACAO_COORDENADOR: { label: "Aguardando sua aprovação", color: "warning" },
  CONCLUIDA: { label: "Concluída", color: "positive" },
  REPROVADA_PELO_COORDENADOR: { label: "Reprovada pelo coordenador", color: "negative" },
};

export default function OccurrencesPage() {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.toLocaleLowerCase("pt-BR");
  const filteredRequests = maintenanceRequests.filter((request) =>
    [request.numberCard, request.machine, request.place, request.createdBy].some((value) =>
      value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
    ),
  );

  return (
    <LayoutDesktop>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Ocorrências</h1>
          <p className="mt-1 text-gray-500">Revise as ordens encaminhadas pelos professores e aprove a conclusão.</p>
        </div>

        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar por número, máquina, local ou solicitante..." />

        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const status = statuses[request.status];
            return (
              <DataRowCard
                key={request.id}
                actions={
                  <Link href={`/ocorrencias/${request.id}`}>
                    <Button variant="secondary" icon={Eye}>Analisar ordem</Button>
                  </Link>
                }
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">{request.numberCard}</h2>
                    <LabelWithCircle status={status.color} text={status.label} />
                  </div>
                  <p className="font-medium text-gray-800">{request.workOrder.number} · {request.machine}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                    <span><strong>Local:</strong> {request.place}</span>
                    <span><strong>Professor:</strong> {request.notifiedTeacher}</span>
                    <span><strong>Prioridade:</strong> {request.priority}</span>
                  </div>
                </div>
              </DataRowCard>
            );
          })}
          {filteredRequests.length === 0 && <p className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">Nenhuma ocorrência encontrada.</p>}
        </div>
      </div>
    </LayoutDesktop>
  );
}
