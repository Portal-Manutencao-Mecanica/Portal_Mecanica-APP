"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Buy } from "@/lib/api/types";
import { buyService } from "@/services/buyService";
import { getServiceErrorMessage } from "@/services/httpService";
import type { LabelStatus } from "@/types/LabelStatus";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

function statusDetails(status: string): { label: string; color: LabelStatus } {
  const label = status
    .replaceAll("_", " ")
    .toLocaleLowerCase("pt-BR")
    .replace(/^./, (letter) => letter.toLocaleUpperCase("pt-BR"));

  return {
    label,
    color: status.includes("REPROV")
      ? "negative"
      : status.includes("APROV")
        ? "positive"
        : "warning",
  };
}

export default function BuyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [buy, setBuy] = useState<Buy | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadBuy() {
      try {
        setBuy(await buyService.getById(id));
      } catch (error) {
        const message = getServiceErrorMessage(
          error,
          "Não foi possível carregar a solicitação de compra.",
        );
        setLoadError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadBuy();
  }, [id]);

  if (loading) {
    return (
      <LayoutDesktop>
        <PageFeedback message="Carregando solicitação de compra..." />
      </LayoutDesktop>
    );
  }

  if (!buy) {
    return (
      <LayoutDesktop>
        <PageFeedback
          variant="error"
          message={loadError || "Solicitação de compra não encontrada."}
        />
      </LayoutDesktop>
    );
  }

  const status = statusDetails(buy.status);

  return (
    <LayoutDesktop breadcrumbLabels={{ 1: `Compra - ${buy.classGroupAcronym}` }}>
      <section className="space-y-6">
        <PageHeader
          title="Solicitação de compra"
          description={`${buy.classGroupAcronym} · Solicitada por ${buy.createdByName}`}
          actions={<Button href="/compras" variant="secondary">Voltar</Button>}
        />

        <section className="grid gap-5 rounded-xl bg-weg-card-white p-6 shadow-sm md:grid-cols-3">
          <Detail label="Situação">
            <LabelWithCircle status={status.color} text={status.label} />
          </Detail>
          <Detail label="Registrada em">
            {dateFormatter.format(new Date(buy.createdAt))}
          </Detail>
          <Detail label="Professor notificado">
            {buy.notifiedTeacherName || "Nenhum professor específico"}
          </Detail>
        </section>

        <section className="rounded-xl bg-weg-card-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Justificativa</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {buy.purchaseJustification}
          </p>
        </section>

        <section className="rounded-xl bg-weg-card-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Itens solicitados</h2>
            <p className="mt-1 text-sm text-gray-500">
              {buy.items.length} {buy.items.length === 1 ? "item solicitado" : "itens solicitados"}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {buy.items.map((item, index) => (
              <article key={item.id} className="rounded-xl bg-gray-50 p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Item {index + 1}
                    </p>
                    <h3 className="mt-1 font-semibold text-gray-900">{item.equipmentName}</h3>
                  </div>
                  <span className="text-sm font-medium text-weg-blue">
                    Quantidade: {item.quantity}
                  </span>
                </div>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <ItemDetail label="Código SAP" value={item.sap} />
                  <ItemDetail label="Patrimônio" value={item.patrimony} />
                  <ItemDetail label="TAG" value={item.tag} />
                  <ItemDetail label="Conjunto mecânico" value={item.mechanicalSet} />
                </dl>

                <div className="mt-4 rounded-lg bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Especificação técnica
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {item.technicalSpecification || "Nenhuma especificação informada."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </LayoutDesktop>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 font-medium text-gray-800">{children}</div>
    </div>
  );
}

function ItemDetail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="mt-1 font-medium text-gray-800">{value || "Não informado"}</dd>
    </div>
  );
}
