"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import DataTable from "@/components/organisms/DataTable";
import { organizationTypeLabels } from "@/components/organisms/OrganizationForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Organization, Page } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { organizationService } from "@/services/organizationService";

const PAGE_SIZE = 10;

export default function OrganizationsPage() {
  const [organizationPage, setOrganizationPage] = useState<Page<Organization> | null>(null);
  const [page, setPage] = useState(0);
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [statusTarget, setStatusTarget] = useState<Organization | null>(null);
  const [changingStatus, setChangingStatus] = useState(false);
  const loading = loadedPage !== page;

  useEffect(() => {
    let active = true;

    organizationService.list({ page, size: PAGE_SIZE, sort: "name,asc" })
      .then((result) => {
        if (!active) return;
        setOrganizationPage(result);
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          getServiceErrorMessage(loadError, "Não foi possível carregar as organizações."),
        );
      })
      .finally(() => {
        if (active) setLoadedPage(page);
      });

    return () => {
      active = false;
    };
  }, [page]);

  const columns = useMemo<ColumnProps<Organization>[]>(() => [
    { header: "Nome", accessorKey: "name" },
    {
      header: "Tipo",
      render: (organization) => organizationTypeLabels[organization.type],
    },
    { header: "Domínio de e-mail", accessorKey: "emailDomain" },
    {
      header: "Situação",
      render: (organization) => (
        <LabelWithCircle
          status={organization.active ? "positive" : "negative"}
          text={organization.active ? "Ativa" : "Inativa"}
        />
      ),
    },
    {
      header: "Ações",
      align: "right",
      render: (organization) => (
        <div className="flex justify-end gap-2">
          <Button
            href={`/organizacoes/${organization.id}/editar`}
            icon={Pencil}
            iconOnly
            aria-label={`Editar organização ${organization.name}`}
            title="Editar organização"
          />
          <Button
            variant={organization.active ? "danger" : "secondary"}
            icon={organization.active ? PowerOff : Power}
            iconOnly
            aria-label={`${organization.active ? "Inativar" : "Ativar"} organização ${organization.name}`}
            title={organization.active ? "Inativar organização" : "Ativar organização"}
            onClick={() => setStatusTarget(organization)}
          />
        </div>
      ),
    },
  ], []);

  async function changeStatus() {
    if (!statusTarget) return;
    setChangingStatus(true);

    try {
      const updated = statusTarget.active
        ? await organizationService.deactivate(statusTarget.id)
        : await organizationService.activate(statusTarget.id);
      setOrganizationPage((current) => current
        ? {
            ...current,
            content: current.content.map((organization) =>
              organization.id === updated.id ? updated : organization,
            ),
          }
        : current);
      toast.success(
        updated.active
          ? "Organização ativada com sucesso."
          : "Organização inativada com sucesso.",
      );
      setStatusTarget(null);
    } catch (statusError) {
      toast.error(
        getServiceErrorMessage(statusError, "Não foi possível alterar a situação da organização."),
      );
    } finally {
      setChangingStatus(false);
    }
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Organizações"
          description="Cadastre e gerencie as organizações vinculadas ao portal."
          actions={<Button href="/organizacoes/nova" icon={Plus}>Nova organização</Button>}
        />

        {loading ? (
          <PageFeedback message="Carregando organizações..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <>
            <DataTable
              data={organizationPage?.content ?? []}
              columns={columns}
              emptyMessage="Nenhuma organização cadastrada."
            />
            <Pagination
              page={organizationPage?.number ?? page}
              totalPages={organizationPage?.totalPages ?? 0}
              totalElements={organizationPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.active ? "Inativar organização" : "Ativar organização"}
        description={statusTarget?.active
          ? "Usuários vinculados não poderão ser cadastrados ou movidos para uma organização inativa. Deseja continuar?"
          : "A organização voltará a ficar disponível para novos cadastros. Deseja continuar?"}
        confirmText={statusTarget?.active ? "Inativar" : "Ativar"}
        confirmVariant={statusTarget?.active ? "danger" : "primary"}
        confirming={changingStatus}
        onCancel={() => setStatusTarget(null)}
        onConfirm={() => void changeStatus()}
      />
    </LayoutDesktop>
  );
}
