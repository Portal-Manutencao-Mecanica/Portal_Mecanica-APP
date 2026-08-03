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
import type { Inconvenience5S } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { inconvenienceService } from "@/services/inconvenienceService";

export default function InconveniencePage() {
  const [items, setItems] = useState<Inconvenience5S[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inconvenienceService.list()
      .then((page) => setItems(page.content))
      .catch((error) => toast.error(getServiceErrorMessage(error, "Não foi possível carregar as ocorrências 5S.")))
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo<ColumnProps<Inconvenience5S>[]>(() => [
    { header: "Ocorrência", accessorKey: "inconvenience" },
    { header: "Local", accessorKey: "placeName" },
    { header: "Turma", accessorKey: "classGroupAcronym" },
    { header: "Professor", accessorKey: "notifiedTeacherName" },
    { header: "Situação", render: (item) => <LabelWithCircle status={item.status === "RESOLVIDA" ? "positive" : "warning"} text={item.status.replaceAll("_", " ")} /> },
    { header: "Ações", align: "right", render: (item) => <Button href={`/incoveniencia5s/${item.id}`} variant="secondary" icon={Eye} iconOnly aria-label={`Visualizar ocorrência 5S ${item.inconvenience}`} title="Visualizar ocorrência 5S" /> },
  ], []);

  return <LayoutDesktop><div className="space-y-6">
    <PageHeader title="Inconveniências 5S" description="Gerencie todas as ocorrências registradas." actions={<Link href="/incoveniencia5s/nova"><Button>Nova ocorrência 5S</Button></Link>} />
    {loading ? <PageFeedback message="Carregando ocorrências..." /> : <DataTable data={items} columns={columns} searchKeys={["inconvenience", "placeName", "classGroupAcronym"]} searchPlaceholder="Pesquisar ocorrência..." emptyMessage="Nenhuma ocorrência encontrada." />}
  </div></LayoutDesktop>;
}
