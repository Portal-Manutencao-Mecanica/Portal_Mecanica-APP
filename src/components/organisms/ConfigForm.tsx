"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ToggleButton from "@/components/atoms/ToggleButton";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import type { NotificationPreferences } from "@/lib/api/types";
import { passwordRequirements, passwordSchema } from "@/lib/validation/password";
import { authService } from "@/services/authService";
import { getServiceErrorMessage } from "@/services/httpService";
import { userService } from "@/services/userService";

const profileSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(2, "Informe um nome válido."),
    v.maxLength(150, "O nome deve possuir no máximo 150 caracteres."),
  ),
});

const changePasswordSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(v.string(), v.minLength(1, "Informe a senha atual.")),
    newPassword: passwordSchema,
    passwordConfirmation: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["passwordConfirmation"]],
      (input) => input.newPassword === input.passwordConfirmation,
      "As senhas digitadas não coincidem.",
    ),
    ["passwordConfirmation"],
  ),
);

type PasswordField =
  | "currentPassword"
  | "newPassword"
  | "passwordConfirmation";

const preferenceKeys: Array<keyof NotificationPreferences> = [
  "emailEnabled",
  "inAppEnabled",
  "occurrenceNotifications",
  "purchaseNotifications",
  "inspectionNotifications",
];

export default function ConfigForm() {
  const router = useRouter();
  const { isLoading, logout, logoutAll, refreshSession, user } = useAuth();
  const [nameDraft, setNameDraft] = useState<{ userId: string; value: string } | null>(null);
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [savedPreferences, setSavedPreferences] = useState<NotificationPreferences | null>(null);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [preferencesError, setPreferencesError] = useState("");
  const [preferencesRevision, setPreferencesRevision] = useState(0);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<PasswordField, string>>
  >({});
  const [changingPassword, setChangingPassword] = useState(false);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const name = user && nameDraft?.userId === user.id
    ? nameDraft.value
    : user?.name ?? "";
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    let active = true;
    userService
      .getOwnProfile()
      .then((profile) => {
        if (!active) return;
        setPreferences(profile.preferences);
        setSavedPreferences(profile.preferences);
        setPreferencesError("");
      })
      .catch((error) => {
        if (!active) return;
        setPreferencesError(
          getServiceErrorMessage(
            error,
            "Não foi possível carregar as preferências.",
          ),
        );
      })
      .finally(() => {
        if (active) setPreferencesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [preferencesRevision, userId]);

  async function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingName || !user) return;

    const result = v.safeParse(profileSchema, { name });
    if (!result.success) {
      setNameError(result.issues[0]?.message ?? "Revise o nome informado.");
      return;
    }

    setSavingName(true);
    try {
      await userService.updateOwnProfile(result.output.name);
      await refreshSession();
      setNameDraft({ userId: user.id, value: result.output.name });
      toast.success("Nome atualizado com sucesso.");
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível atualizar o nome."),
      );
    } finally {
      setSavingName(false);
    }
  }

  function updatePreference(
    key: keyof NotificationPreferences,
    value: boolean,
  ) {
    setPreferences((current) => current ? { ...current, [key]: value } : current);
  }

  async function savePreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preferences || !savedPreferences || savingPreferences) return;

    const changes = Object.fromEntries(
      preferenceKeys
        .filter((key) => preferences[key] !== savedPreferences[key])
        .map((key) => [key, preferences[key]]),
    );
    if (Object.keys(changes).length === 0) return;

    setSavingPreferences(true);
    try {
      const profile = await userService.updateNotificationPreferences(changes);
      setPreferences(profile.preferences);
      setSavedPreferences(profile.preferences);
      toast.success("Preferências atualizadas com sucesso.");
    } catch (error) {
      toast.error(
        getServiceErrorMessage(
          error,
          "Não foi possível atualizar as preferências.",
        ),
      );
    } finally {
      setSavingPreferences(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (changingPassword) return;

    const result = v.safeParse(changePasswordSchema, {
      currentPassword,
      newPassword,
      passwordConfirmation,
    });
    if (!result.success) {
      const nextErrors: Partial<Record<PasswordField, string>> = {};
      for (const issue of result.issues) {
        const key = issue.path?.[0]?.key;
        if (typeof key === "string" && !(key in nextErrors)) {
          nextErrors[key as PasswordField] = issue.message;
        }
      }
      setPasswordErrors(nextErrors);
      toast.error(result.issues[0]?.message ?? "Revise as senhas informadas.");
      return;
    }

    setChangingPassword(true);
    try {
      await authService.changePassword(result.output);
      toast.success("Senha alterada. Entre novamente com a nova senha.");
      await logout();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível alterar a senha."),
      );
      setChangingPassword(false);
    }
  }

  async function revokeAllSessions() {
    if (loggingOutAll) return;
    setLoggingOutAll(true);
    try {
      await logoutAll();
      toast.success("Todas as sessões foram encerradas.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(
          error,
          "Não foi possível encerrar todas as sessões.",
        ),
      );
      setLoggingOutAll(false);
      setLogoutAllOpen(false);
    }
  }

  if (isLoading || !user) {
    return <PageFeedback message="Carregando configurações..." />;
  }

  const unchangedName = name.trim() === user.name;
  const preferencesUnchanged = !preferences || !savedPreferences || preferenceKeys.every(
    (key) => preferences[key] === savedPreferences[key],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie seus dados, notificações e segurança de acesso."
      />

      <form
        onSubmit={saveName}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Dados pessoais</h2>
          <p className="mt-1 text-sm text-gray-500">
            Atualize o nome exibido no sistema. O e-mail não pode ser alterado aqui.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="profile-name"
            label="Nome"
            value={name}
            onChange={(event) => {
              setNameDraft({ userId: user.id, value: event.target.value });
              setNameError("");
            }}
            error={nameError}
            maxLength={150}
            autoComplete="name"
            required
          />
          <Input
            id="profile-email"
            label="E-mail"
            value={user.email}
            disabled
            readOnly
          />
        </div>

        <div className="flex justify-end border-t border-gray-200 pt-4">
          <Button
            type="submit"
            disabled={savingName || unchangedName || !name.trim()}
          >
            {savingName ? "Salvando..." : "Salvar nome"}
          </Button>
        </div>
      </form>

      <form
        onSubmit={savePreferences}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Preferências de notificação</h2>
          <p className="mt-1 text-sm text-gray-500">
            Escolha os canais e assuntos sobre os quais deseja receber avisos.
          </p>
        </div>

        {preferencesLoading ? (
          <PageFeedback message="Carregando preferências..." />
        ) : preferencesError ? (
          <div className="space-y-3">
            <PageFeedback variant="error" message={preferencesError} />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPreferencesLoading(true);
                  setPreferencesRevision((current) => current + 1);
                }}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : preferences ? (
          <>
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-gray-800">Canais</legend>
              <PreferenceRow
                label="Notificações no portal"
                description="Exibe avisos na central de notificações do sistema."
                checked={preferences.inAppEnabled}
                onToggle={(checked) => updatePreference("inAppEnabled", checked)}
              />
              <PreferenceRow
                label="Notificações por e-mail"
                description="Envia avisos para o e-mail cadastrado na conta."
                checked={preferences.emailEnabled}
                onToggle={(checked) => updatePreference("emailEnabled", checked)}
              />
            </fieldset>

            <fieldset className="space-y-3 border-t border-gray-200 pt-5">
              <legend className="text-sm font-semibold text-gray-800">Assuntos</legend>
              <PreferenceRow
                label="Ocorrências"
                description="Atualizações sobre solicitações e ocorrências de manutenção."
                checked={preferences.occurrenceNotifications}
                onToggle={(checked) =>
                  updatePreference("occurrenceNotifications", checked)
                }
              />
              <PreferenceRow
                label="Compras"
                description="Mudanças de situação e andamento das solicitações de compra."
                checked={preferences.purchaseNotifications}
                onToggle={(checked) =>
                  updatePreference("purchaseNotifications", checked)
                }
              />
              <PreferenceRow
                label="Inspeções"
                description="Avisos relacionados a inspeções e manutenções autônomas."
                checked={preferences.inspectionNotifications}
                onToggle={(checked) =>
                  updatePreference("inspectionNotifications", checked)
                }
              />
            </fieldset>
          </>
        ) : null}

        <div className="flex justify-end border-t border-gray-200 pt-4">
          <Button
            type="submit"
            disabled={
              preferencesLoading ||
              Boolean(preferencesError) ||
              savingPreferences ||
              preferencesUnchanged
            }
          >
            {savingPreferences ? "Salvando..." : "Salvar preferências"}
          </Button>
        </div>
      </form>

      <form
        onSubmit={changePassword}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Trocar senha</h2>
          <p className="mt-1 text-sm text-gray-500">
            Confirme sua senha atual antes de definir uma nova credencial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Input
            id="current-password"
            label="Senha atual *"
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setPasswordErrors((current) => ({ ...current, currentPassword: undefined }));
            }}
            error={passwordErrors.currentPassword}
            autoComplete="current-password"
            required
          />
          <Input
            id="new-password"
            label="Nova senha *"
            type="password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setPasswordErrors((current) => ({ ...current, newPassword: undefined }));
            }}
            error={passwordErrors.newPassword}
            autoComplete="new-password"
            required
          />
          <Input
            id="password-confirmation"
            label="Confirmar nova senha *"
            type="password"
            value={passwordConfirmation}
            onChange={(event) => {
              setPasswordConfirmation(event.target.value);
              setPasswordErrors((current) => ({
                ...current,
                passwordConfirmation: undefined,
              }));
            }}
            error={passwordErrors.passwordConfirmation}
            autoComplete="new-password"
            required
          />
        </div>
        <p className="text-xs text-gray-500">{passwordRequirements}</p>

        <div className="flex justify-end border-t border-gray-200 pt-4">
          <Button type="submit" icon={ShieldCheck} disabled={changingPassword}>
            {changingPassword ? "Alterando..." : "Alterar senha"}
          </Button>
        </div>
      </form>

      <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Sessões ativas</h2>
            <p className="mt-1 text-sm text-gray-500">
              Encerre o acesso desta conta em todos os navegadores e dispositivos.
            </p>
          </div>
          <Button
            variant="danger"
            icon={LogOut}
            onClick={() => setLogoutAllOpen(true)}
          >
            Sair de todos os dispositivos
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={logoutAllOpen}
        title="Sair de todos os dispositivos"
        description="Todas as sessões ativas, incluindo esta, serão encerradas. Para continuar, será necessário entrar novamente."
        confirmText="Encerrar todas as sessões"
        confirmVariant="danger"
        confirming={loggingOutAll}
        onCancel={() => setLogoutAllOpen(false)}
        onConfirm={revokeAllSessions}
      />
    </section>
  );
}

function PreferenceRow({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-weg-card-white p-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      <ToggleButton
        variant="switch"
        label={label}
        checked={checked}
        onToggle={onToggle}
      />
    </div>
  );
}
