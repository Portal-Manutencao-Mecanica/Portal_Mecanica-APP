"use client";

import { useState } from "react";
import { KeyRound, Lock, Power, PowerOff, ShieldCheck, Unlock } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import type { ManagedUser, UserRole } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { userService } from "@/services/userService";

const roleLabels: Record<UserRole, string> = {
  ALUNO: "Aluno",
  PROFESSOR: "Professor",
  COORDENADOR: "Coordenador",
  ADMIN: "Administrador",
};

type PendingAction =
  | "role"
  | "deactivate"
  | "reactivate"
  | "block"
  | "unblock"
  | "resetPassword";

interface UserAdministrationActionsProps {
  managedUser: ManagedUser;
  onChange: (managedUser: ManagedUser) => void;
}

export default function UserAdministrationActions({
  managedUser,
  onChange,
}: UserAdministrationActionsProps) {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(managedUser.role);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isOwnAccount = user?.id === managedUser.id;

  async function confirmAction() {
    if (!pendingAction) return;
    setSubmitting(true);

    try {
      let updated: ManagedUser | null = null;
      switch (pendingAction) {
        case "role":
          updated = await userService.changeRole(managedUser.id, selectedRole);
          break;
        case "deactivate":
          updated = await userService.deactivate(managedUser.id);
          break;
        case "reactivate":
          updated = await userService.reactivate(managedUser.id);
          break;
        case "block":
          updated = await userService.block(managedUser.id);
          break;
        case "unblock":
          updated = await userService.unblock(managedUser.id);
          break;
        case "resetPassword": {
          await userService.resetPassword(managedUser.id);
          onChange({ ...managedUser, passwordChangeRequired: true });
          toast.success(
            `Senha resetada. O envio da nova senha temporária para ${managedUser.email} foi iniciado.`,
          );
          break;
        }
      }

      if (updated) onChange(updated);
      if (pendingAction !== "resetPassword") toast.success(successMessage(pendingAction));
      setPendingAction(null);
    } catch (actionError) {
      toast.error(
        getServiceErrorMessage(actionError, "Não foi possível concluir a ação administrativa."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const dialog = pendingAction ? actionDialog(pendingAction, selectedRole) : null;

  return (
    <section className="space-y-5 rounded-xl border border-gray-200 bg-weg-card-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Ações administrativas</h2>
        <p className="mt-1 text-sm text-gray-500">
          Altere o acesso, a situação da conta ou redefina a senha do usuário.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800">Perfil de acesso</h3>
          <DropDown
            id="managed-user-role"
            label="Perfil"
            defaultSelection="Selecione o perfil"
            enumData={roleLabels}
            value={selectedRole}
            onSelect={(value) => setSelectedRole(value as UserRole)}
            disabled={isOwnAccount || submitting}
          />
          <Button
            icon={ShieldCheck}
            disabled={isOwnAccount || submitting || selectedRole === managedUser.role}
            onClick={() => setPendingAction("role")}
          >
            Alterar perfil
          </Button>
        </div>

        <div className="space-y-3 rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800">Situação da conta</h3>
          <p className="text-sm text-gray-500">
            {managedUser.enabled ? "Conta ativa" : "Conta inativa"}
            {managedUser.accountNonLocked ? " e desbloqueada." : " e bloqueada."}
            {managedUser.passwordChangeRequired && " Primeiro acesso pendente."}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={managedUser.enabled ? "danger" : "secondary"}
              icon={managedUser.enabled ? PowerOff : Power}
              disabled={isOwnAccount || submitting}
              onClick={() => setPendingAction(managedUser.enabled ? "deactivate" : "reactivate")}
            >
              {managedUser.enabled ? "Inativar" : "Reativar"}
            </Button>
            <Button
              variant={managedUser.accountNonLocked ? "warning" : "secondary"}
              icon={managedUser.accountNonLocked ? Lock : Unlock}
              disabled={isOwnAccount || submitting || !managedUser.enabled}
              onClick={() => setPendingAction(managedUser.accountNonLocked ? "block" : "unblock")}
            >
              {managedUser.accountNonLocked ? "Bloquear" : "Desbloquear"}
            </Button>
            <Button
              variant="warning"
              icon={KeyRound}
              disabled={submitting || !managedUser.enabled || !managedUser.accountNonLocked}
              onClick={() => setPendingAction("resetPassword")}
            >
              Resetar senha
            </Button>
          </div>
          {isOwnAccount && (
            <p className="text-xs text-gray-500">
              Perfil, bloqueio e situação da própria conta não podem ser alterados aqui.
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(dialog)}
        title={dialog?.title ?? "Confirmar ação"}
        description={dialog?.description ?? "Deseja continuar?"}
        confirmText={dialog?.confirmText}
        confirmVariant={dialog?.variant}
        confirming={submitting}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => void confirmAction()}
      />
    </section>
  );
}

function actionDialog(action: PendingAction, role: UserRole) {
  const values = {
    role: {
      title: "Alterar perfil",
      description: `O usuário passará a possuir o perfil ${roleLabels[role]}. Deseja continuar?`,
      confirmText: "Alterar perfil",
      variant: "warning" as const,
    },
    deactivate: {
      title: "Inativar usuário",
      description: "O usuário perderá o acesso ao portal. Deseja continuar?",
      confirmText: "Inativar",
      variant: "danger" as const,
    },
    reactivate: {
      title: "Reativar usuário",
      description: "O acesso do usuário será restabelecido. Deseja continuar?",
      confirmText: "Reativar",
      variant: "primary" as const,
    },
    block: {
      title: "Bloquear usuário",
      description: "As sessões atuais serão encerradas e novos acessos serão bloqueados.",
      confirmText: "Bloquear",
      variant: "warning" as const,
    },
    unblock: {
      title: "Desbloquear usuário",
      description: "O usuário poderá voltar a autenticar no portal.",
      confirmText: "Desbloquear",
      variant: "primary" as const,
    },
    resetPassword: {
      title: "Resetar senha",
      description: "A senha atual deixará de funcionar, as sessões serão encerradas e uma nova senha temporária será enviada ao e-mail cadastrado. No próximo login, o usuário deverá concluir o primeiro acesso.",
      confirmText: "Resetar senha",
      variant: "warning" as const,
    },
  };
  return values[action];
}

function successMessage(action: Exclude<PendingAction, "resetPassword">) {
  return {
    role: "Perfil atualizado com sucesso.",
    deactivate: "Usuário inativado com sucesso.",
    reactivate: "Usuário reativado com sucesso.",
    block: "Usuário bloqueado com sucesso.",
    unblock: "Usuário desbloqueado com sucesso.",
  }[action];
}
