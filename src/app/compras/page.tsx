"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Buy } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { buyService } from "@/services/buyService";
import { getServiceErrorMessage } from "@/services/httpService";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export default function BuyPage() {
  const [buys, setBuys] = useState<Buy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buyService.list()
      .then((page) => setBuys(page.content))
      .catch((error) => toast.error(getServiceErrorMessage(error, "Não foi possível carregar as solicitações de compra.")))
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo<ColumnProps<Buy>[]>(() => [
    { header: "Solicitante", accessorKey: "createdByName" },
    { header: "Turma", accessorKey: "classGroupAcronym" },
    { header: "Justificativa", accessorKey: "purchaseJustification" },
    { header: "Itens", render: (buy) => buy.items.length, align: "center" },
    { header: "Data", render: (buy) => dateFormatter.format(new Date(buy.createdAt)) },
    { header: "Situação", render: (buy) => <LabelWithCircle status={buy.status.includes("REPROV") ? "negative" : buy.status.includes("APROV") ? "positive" : "warning"} text={buy.status.replaceAll("_", " ")} /> },
    { header: "Ações", align: "right", render: (buy) => <Link href={`/compras/${buy.id}`}><Button variant="secondary">Ver detalhes</Button></Link> },
  ], []);

  return <LayoutDesktop><div className="space-y-6">
    <PageHeader title="Solicitações de compras" description="Gerencie as solicitações enviadas pelos professores." actions={<Link href="/compras/cadastro"><Button>Nova compra</Button></Link>} />
    {loading ? <PageFeedback message="Carregando solicitações..." /> : <DataTable data={buys} columns={columns} searchKeys={["createdByName", "classGroupAcronym", "purchaseJustification"]} searchPlaceholder="Pesquisar solicitação..." emptyMessage="Nenhuma solicitação encontrada." />}
  </div></LayoutDesktop>;
}
