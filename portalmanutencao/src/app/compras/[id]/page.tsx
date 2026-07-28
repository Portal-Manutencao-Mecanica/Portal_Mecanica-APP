"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Buy } from "@/lib/api/types";
import { buyService } from "@/services/buyService";
import type { LabelStatus } from "@/types/LabelStatus";

const statusStyle: Record<string, LabelStatus> = {
  NAO_VISUALIZADO: "warning",
  VISUALIZADO: "default",
  APROVADO: "positive",
  REPROVADO: "negative",
};

export default function BuyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [buy, setBuy] = useState<Buy | null>(null);

  useEffect(() => {
    buyService.getById(id).then(setBuy).catch(() => setBuy(null));
  }, [id]);

  return (
    <LayoutDesktop>
      {!buy ? <p className="ui-surface p-8 text-gray-500">Carregando compra...</p> : (
        <div className="ui-page">
          <div className="flex items-center justify-between">
            <div><h1 className="text-3xl font-bold">{buy.id}</h1><p className="text-gray-500">Detalhes da solicitação de compra.</p></div>
            <LabelWithCircle status={statusStyle[buy.status] ?? "default"} text={buy.status} />
          </div>
          <div className="ui-surface grid gap-6 p-8 md:grid-cols-2">
            <Detail label="Professor" value={buy.createdByName} />
            <Detail label="Turma" value={buy.classGroupAcronym} />
            <Detail label="Data" value={new Intl.DateTimeFormat("pt-BR").format(new Date(buy.createdAt))} />
            <Detail label="Quantidade de itens" value={String(buy.items.length)} />
            <div className="md:col-span-2"><Detail label="Justificativa" value={buy.purchaseJustification} /></div>
          </div>
          <div className="ui-surface space-y-4 p-8">
            <h2 className="text-2xl font-semibold">Itens solicitados</h2>
            {buy.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold">{item.equipmentName}</h3>
                <p className="mt-2 text-sm text-gray-600">Quantidade: {item.quantity} · SAP: {item.sap || "-"}</p>
                <p className="mt-2 text-sm">{item.technicalSpecification}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-semibold">{value || "-"}</p></div>;
}
