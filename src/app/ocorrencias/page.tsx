"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { MaintenanceRequestApi } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";

export default function OccurrencesPage() {
  const [requests, setRequests] = useState<MaintenanceRequestApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    maintenanceRequestService.list()
      .then(setRequests)
      .catch((error) => toast.error(getServiceErrorMessage(error, "Não foi possível carregar as ocorrências.")))
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo<ColumnProps<MaintenanceRequestApi>[]>(() => [
    { header: "Máquina", accessorKey: "machineName" },
    { header: "Local", accessorKey: "placeName" },
    { header: "Professor", accessorKey: "notifiedTeacherName" },
    { header: "Prioridade", accessorKey: "priority" },
    { header: "Situação", render: (item) => <LabelWithCircle status={item.status === "APROVADA_PELO_PROFESSOR" || item.status === "FINALIZADA" ? "positive" : item.status.includes("REPROV") ? "negative" : "warning"} text={item.status.replaceAll("_", " ")} /> },
    { header: "Ações", align: "right", render: (item) => <Link href={`/ocorrencias/${item.id}`}><Button variant="secondary" icon={Eye}>Analisar</Button></Link> },
  ], []);

  return <LayoutDesktop><div className="space-y-6">
    <PageHeader title="Ocorrências" description="Gerencie todas as ocorrências cadastradas." actions={<Link href="/ocorrencias/cadastro"><Button>Nova ocorrência</Button></Link>} />
    {loading ? <PageFeedback message="Carregando ocorrências..." /> : <DataTable data={requests} columns={columns} searchKeys={["machineName", "placeName", "notifiedTeacherName", "priority"]} searchPlaceholder="Pesquisar ocorrência..." emptyMessage="Nenhuma ocorrência encontrada." />}
  </div></LayoutDesktop>;
}
