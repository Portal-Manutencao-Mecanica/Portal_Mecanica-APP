"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import BuyForm from "@/components/organisms/BuyForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Buy } from "@/lib/api/types";
import { buyService } from "@/services/buyService";
import { getServiceErrorMessage } from "@/services/httpService";

export default function EditBuyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [buy, setBuy] = useState<Buy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    buyService
      .getById(id)
      .then((result) => {
        if (active) setBuy(result);
      })
      .catch((loadError) => {
        if (!active) return;
        const message = getServiceErrorMessage(
          loadError,
          "Não foi possível carregar a solicitação de compra.",
        );
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <LayoutDesktop
      breadcrumbLabels={buy ? { 1: `Compra - ${buy.classGroupAcronym}` } : undefined}
    >
      <section className="space-y-6">
        <PageHeader
          title="Editar solicitação de compra"
          description="Atualize a turma, os itens e a justificativa da solicitação."
        />
        {loading ? (
          <PageFeedback message="Carregando solicitação de compra..." />
        ) : buy ? (
          <BuyForm buy={buy} />
        ) : (
          <PageFeedback
            variant="error"
            message={error || "Solicitação de compra não encontrada."}
          />
        )}
      </section>
    </LayoutDesktop>
  );
}
