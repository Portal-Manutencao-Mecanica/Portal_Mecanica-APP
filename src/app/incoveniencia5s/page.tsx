"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Inconvenience5S, Page } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { inconvenienceService } from "@/services/inconvenienceService";
import { useAuth } from "@/hooks/useAuth";
import { canCreateInconvenience } from "@/lib/permissions";
import { getStatusPresentation } from "@/lib/status";

const PAGE_SIZE = 10;

export default function InconveniencePage() {
  const router = useRouter();
  const { user } = useAuth();
  const canCreate = canCreateInconvenience(user?.role);
  const [itemPage, setItemPage] = useState<Page<Inconvenience5S> | null>(null);
  const [page, setPage] = useState(0);
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const requestKey = String(page);
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    inconvenienceService
      .list({ page, size: PAGE_SIZE, sort: "createdAt,desc" })
      .then((result) => {
        if (active) {
          setItemPage(result);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            getServiceErrorMessage(loadError, "Não foi possível carregar as ocorrências 5S."),
          );
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [page, requestKey]);

  const columns = useMemo<ColumnProps<Inconvenience5S>[]>(() => [
    { header: "Ocorrência", accessorKey: "inconvenience" },
    { header: "Local", accessorKey: "placeName" },
    { header: "Turma", accessorKey: "classGroupAcronym" },
    { header: "Professor", accessorKey: "notifiedTeacherName" },
    {
      header: "Situação",
      render: (item) => {
        const status = getStatusPresentation(item.status);
        return <LabelWithCircle status={status.color} text={status.label} />;
      },
    },
    {
      header: "Ações",
      align: "right",
      render: (item) => (
        <Button
          href={`/incoveniencia5s/${item.id}`}
          variant="secondary"
          icon={Eye}
          iconOnly
          aria-label={`Visualizar ocorrência 5S ${item.inconvenience}`}
          title="Visualizar ocorrência 5S"
        />
      ),
    },
  ], []);

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Inconveniências 5S"
          description="Gerencie todas as ocorrências registradas."
          actions={canCreate
            ? <Button href="/incoveniencia5s/nova">Nova ocorrência 5S</Button>
            : undefined}
        />
        {loading ? (
          <PageFeedback message="Carregando ocorrências..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <>
            <DataTable
              data={itemPage?.content ?? []}
              onRowClick={(item) => router.push(`/incoveniencia5s/${item.id}`)}
              getRowAriaLabel={(item) => `Visualizar ocorrÃªncia 5S ${item.inconvenience}`}
              columns={columns}
              searchKeys={["inconvenience", "placeName", "classGroupAcronym"]}
              searchPlaceholder="Pesquisar ocorrência..."
              emptyMessage="Nenhuma ocorrência encontrada."
            />
            <Pagination
              page={itemPage?.number ?? page}
              totalPages={itemPage?.totalPages ?? 0}
              totalElements={itemPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}
