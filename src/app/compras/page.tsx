"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil } from "lucide-react";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Buy, Page } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { buyService } from "@/services/buyService";
import { getServiceErrorMessage } from "@/services/httpService";
import { useAuth } from "@/hooks/useAuth";
import { canEditPurchase } from "@/lib/permissions";
import { getStatusPresentation } from "@/lib/status";

const PAGE_SIZE = 10;
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function BuyPage() {
  const { user } = useAuth();
  const [buyPage, setBuyPage] = useState<Page<Buy> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const requestKey = `${page}:${debouncedSearch}:${status}`;
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    buyService
      .list({
        page,
        size: PAGE_SIZE,
        sort: "createdAt,desc",
        search: debouncedSearch.trim() || undefined,
        status: status || undefined,
      })
      .then((result) => {
        if (active) {
          setBuyPage(result);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            getServiceErrorMessage(
              loadError,
              "Não foi possível carregar as solicitações de compra.",
            ),
          );
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch, page, requestKey, status]);

  const columns = useMemo<ColumnProps<Buy>[]>(() => [
    { header: "Solicitante", accessorKey: "createdByName" },
    { header: "Turma", accessorKey: "classGroupAcronym" },
    { header: "Justificativa", accessorKey: "purchaseJustification" },
    { header: "Itens", render: (buy) => buy.items.length, align: "center" },
    { header: "Data", render: (buy) => dateFormatter.format(new Date(buy.createdAt)) },
    {
      header: "Situação",
      render: (buy) => {
        const status = getStatusPresentation(buy.status);
        return <LabelWithCircle status={status.color} text={status.label} />;
      },
    },
    {
      header: "Ações",
      align: "right",
      render: (buy) => (
        <div className="flex justify-end gap-2">
          <Button
            href={`/compras/${buy.id}`}
            variant="secondary"
            icon={Eye}
            iconOnly
            aria-label={`Visualizar solicitação de ${buy.createdByName}`}
            title="Visualizar solicitação"
          />
          {canEditPurchase(user?.role, user?.id, buy) && (
            <Button
              href={`/compras/${buy.id}/editar`}
              icon={Pencil}
              iconOnly
              aria-label={`Editar solicitação de ${buy.createdByName}`}
              title="Editar solicitação"
            />
          )}
        </div>
      ),
    },
  ], [user?.id, user?.role]);

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Solicitações de compras"
          description="Gerencie as solicitações enviadas pelos professores."
          actions={<Button href="/compras/cadastro">Nova compra</Button>}
        />
        {loading ? (
          <PageFeedback message="Carregando solicitações..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <>
            <DataTable
              data={buyPage?.content ?? []}
              columns={columns}
              searchKeys={["createdByName", "classGroupAcronym", "purchaseJustification"]}
              searchValue={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(0);
              }}
              searchPlaceholder="Pesquisar solicitação..."
              emptyMessage="Nenhuma solicitação encontrada."
              filterElement={
                <div className="w-full sm:w-56">
                  <DropDown
                    id="buy-status-filter"
                    defaultSelection="Todas as situações"
                    enumData={{
                      NAO_VISUALIZADO: "Não visualizada",
                      EM_ANALISE: "Em análise",
                      PEDIDO_EM_ANDAMENTO: "Pedido em andamento",
                      ENTREGUE: "Entregue",
                    }}
                    value={status}
                    onSelect={(value) => {
                      setStatus(value);
                      setPage(0);
                    }}
                  />
                </div>
              }
            />
            <Pagination
              page={buyPage?.number ?? page}
              totalPages={buyPage?.totalPages ?? 0}
              totalElements={buyPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}
