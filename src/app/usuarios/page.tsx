"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { ManagedUser, Page, UserRole } from "@/lib/api/types";
import { canEditUsers } from "@/lib/permissions";
import type { ColumnProps } from "@/props/ColumnProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { userService } from "@/services/userService";

const PAGE_SIZE = 10;
const roleLabels: Record<UserRole, string> = {
  ALUNO: "Aluno",
  PROFESSOR: "Professor",
  COORDENADOR: "Coordenador",
  ADMIN: "Administrador",
};

type StatusAction = {
  managedUser: ManagedUser;
  type: "deactivate" | "reactivate";
};

export default function UsersPage() {
  const { user } = useAuth();
  const [userPage, setUserPage] = useState<Page<ManagedUser> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"" | UserRole>("");
  const [enabled, setEnabled] = useState("");
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [statusAction, setStatusAction] = useState<StatusAction | null>(null);
  const [changingStatus, setChangingStatus] = useState(false);
  const debouncedSearch = useDebouncedValue(search);
  const requestKey = `${page}:${debouncedSearch}:${role}:${enabled}`;
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    userService.list({
      page,
      size: PAGE_SIZE,
      sort: "name,asc",
      search: debouncedSearch.trim() || undefined,
      role: role || undefined,
      enabled: enabled ? enabled === "ACTIVE" : undefined,
    })
      .then((result) => {
        if (!active) return;
        setUserPage(result);
        setError("");
      })
      .catch((loadError) => {
        if (active) {
          setError(getServiceErrorMessage(loadError, "Não foi possível carregar os usuários."));
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch, enabled, page, requestKey, role]);

  const columns = useMemo<ColumnProps<ManagedUser>[]>(() => [
    { header: "Nome", accessorKey: "name" },
    { header: "Crachá", accessorKey: "numberCard" },
    { header: "E-mail", accessorKey: "email" },
    { header: "Perfil", render: (managedUser) => roleLabels[managedUser.role] },
    { header: "Organização", render: (managedUser) => managedUser.organization.name },
    {
      header: "Situação",
      render: (managedUser) => {
        const status = !managedUser.enabled
          ? { label: "Inativo", variant: "negative" as const }
          : !managedUser.accountNonLocked
            ? { label: "Bloqueado", variant: "warning" as const }
            : { label: "Ativo", variant: "positive" as const };
        return <LabelWithCircle status={status.variant} text={status.label} />;
      },
    },
    {
      header: "Ações",
      align: "right",
      render: (managedUser) => {
        const isOwnAccount = managedUser.id === user?.id;
        const canReactivate = user?.role === "ADMIN";
        return (
          <div className="flex justify-end gap-2">
            {canEditUsers(user?.role) && (
              <Button
                href={`/usuarios/${managedUser.id}/editar`}
                icon={Pencil}
                iconOnly
                aria-label={`Editar usuário ${managedUser.name}`}
                title="Editar usuário"
              />
            )}
            {!isOwnAccount && managedUser.enabled && (
              <Button
                variant="danger"
                icon={PowerOff}
                iconOnly
                aria-label={`Inativar usuário ${managedUser.name}`}
                title="Inativar usuário"
                onClick={() => setStatusAction({ managedUser, type: "deactivate" })}
              />
            )}
            {!isOwnAccount && !managedUser.enabled && canReactivate && (
              <Button
                variant="secondary"
                icon={Power}
                iconOnly
                aria-label={`Reativar usuário ${managedUser.name}`}
                title="Reativar usuário"
                onClick={() => setStatusAction({ managedUser, type: "reactivate" })}
              />
            )}
          </div>
        );
      },
    },
  ], [user?.id, user?.role]);

  async function changeStatus() {
    if (!statusAction) return;
    setChangingStatus(true);
    try {
      const updated = statusAction.type === "deactivate"
        ? await userService.deactivate(statusAction.managedUser.id)
        : await userService.reactivate(statusAction.managedUser.id);
      setUserPage((current) => current
        ? {
            ...current,
            content: current.content.map((managedUser) =>
              managedUser.id === updated.id ? updated : managedUser,
            ),
          }
        : current);
      toast.success(
        statusAction.type === "deactivate"
          ? "Usuário inativado com sucesso."
          : "Usuário reativado com sucesso.",
      );
      setStatusAction(null);
    } catch (statusError) {
      toast.error(
        getServiceErrorMessage(statusError, "Não foi possível alterar a situação do usuário."),
      );
    } finally {
      setChangingStatus(false);
    }
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Usuários"
          description="Cadastre pessoas e gerencie os acessos ao portal."
          actions={<Button href="/usuarios/novo" icon={Plus}>Novo usuário</Button>}
        />

        {loading ? (
          <PageFeedback message="Carregando usuários..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <>
            <DataTable
              data={userPage?.content ?? []}
              columns={columns}
              searchKeys={["name", "numberCard", "email"]}
              searchValue={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(0);
              }}
              searchPlaceholder="Pesquisar por nome, crachá ou e-mail"
              emptyMessage="Nenhum usuário encontrado."
              filterElement={(
                <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
                  <DropDown
                    id="user-role-filter"
                    defaultSelection="Todos os perfis"
                    enumData={roleLabels}
                    value={role}
                    onSelect={(value) => {
                      setRole(value as "" | UserRole);
                      setPage(0);
                    }}
                  />
                  <DropDown
                    id="user-status-filter"
                    defaultSelection="Todas as situações"
                    enumData={{ ACTIVE: "Ativos", INACTIVE: "Inativos" }}
                    value={enabled}
                    onSelect={(value) => {
                      setEnabled(value);
                      setPage(0);
                    }}
                  />
                </div>
              )}
            />
            <Pagination
              page={userPage?.number ?? page}
              totalPages={userPage?.totalPages ?? 0}
              totalElements={userPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(statusAction)}
        title={statusAction?.type === "deactivate" ? "Inativar usuário" : "Reativar usuário"}
        description={statusAction?.type === "deactivate"
          ? "O usuário perderá o acesso ao portal. Deseja continuar?"
          : "O acesso do usuário será restabelecido. Deseja continuar?"}
        confirmText={statusAction?.type === "deactivate" ? "Inativar" : "Reativar"}
        confirmVariant={statusAction?.type === "deactivate" ? "danger" : "primary"}
        confirming={changingStatus}
        onCancel={() => setStatusAction(null)}
        onConfirm={() => void changeStatus()}
      />
    </LayoutDesktop>
  );
}
