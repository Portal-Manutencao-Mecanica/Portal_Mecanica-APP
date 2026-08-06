"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  GraduationCap,
  Link2,
  MessageSquareWarning,
  MonitorCog,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react";

import { StatCard } from "@/components/atoms/StatCard";
import { ActionCard } from "@/components/molecules/ActionCard";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { Table } from "@/components/organisms/Table";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type { MaintenanceRequestApi, Notification } from "@/lib/api/types";
import type { ActionCardProps } from "@/props/ActionCardProps";
import type { StatCardProps } from "@/props/StatCardProps";
import type { Column } from "@/props/TableProps";
import type { LabelStatus } from "@/types/LabelStatus";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";
import { notificationService } from "@/services/notificationService";
import { getStatusPresentation } from "@/lib/status";

interface OccurrenceHome {
  id: string;
  description: string;
  date: string;
  priorityText: string;
  priorityStatus: LabelStatus;
  statusText: string;
  statusType: LabelStatus;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Data não informada";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getPriorityType(priority: string): LabelStatus {
  if (priority === "ALTA") return "negative";
  if (priority === "MEDIA") return "warning";

  return "default";
}

export default function Home() {
  const { user } = useAuth();
  const [machines, setMachines] = useState<{ condition: "CONFORME" | "NAO_CONFORME" }[]>([]);
  const [classGroups, setClassGroups] = useState<{ enabled: boolean }[]>([]);
  const [occurrences, setOccurrences] = useState<MaintenanceRequestApi[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [machinesResult, classGroupsResult, occurrencesResult, notificationsResult] = await Promise.allSettled([
          machineService.list(1000),
          classGroupBrowserService.list(1000),
          maintenanceRequestService.list({ size: 1000, sort: "createdAt,desc" }),
          notificationService.list(),
        ]);

        if (!isMounted) return;

        if (machinesResult.status === "fulfilled") setMachines(machinesResult.value.content);
        if (classGroupsResult.status === "fulfilled") setClassGroups(classGroupsResult.value.content);
        if (occurrencesResult.status === "fulfilled") setOccurrences(occurrencesResult.value.content);
        if (notificationsResult.status === "fulfilled") {
          const notifications = notificationsResult.value.content;
          setNotification(notifications.find((item) => !item.statusRead) ?? notifications[0] ?? null);
        }

        const mainRequestFailure = [machinesResult, classGroupsResult, occurrencesResult]
          .find((result) => result.status === "rejected");

        if (mainRequestFailure?.status === "rejected") {
          setError(getServiceErrorMessage(mainRequestFailure.reason, "Não foi possível carregar todos os dados da página inicial."));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getServiceErrorMessage(loadError, "Não foi possível carregar os dados da página inicial."));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo<StatCardProps[]>(() => {
    const operationalMachines = machines.filter((machine) => machine.condition === "CONFORME").length;
    const machinesInMaintenance = machines.filter((machine) => machine.condition === "NAO_CONFORME").length;
    const openOccurrences = occurrences.filter((occurrence) => occurrence.status !== "FINALIZADA").length;
    const activeClassGroups = classGroups.filter((group) => group.enabled).length;

    return [
      {
        label: "Máquinas operacionais",
        value: loading ? "..." : `${operationalMachines}/${machines.length}`,
        icon: CheckCircle2,
      },
      { label: "Em manutenção", value: loading ? "..." : machinesInMaintenance, icon: Wrench },
      { label: "Ocorrências abertas", value: loading ? "..." : openOccurrences, icon: AlertTriangle },
      { label: "Turmas ativas", value: loading ? "..." : activeClassGroups, icon: Users },
    ];
  }, [classGroups, loading, machines, occurrences]);

  const recentOccurrences = useMemo<OccurrenceHome[]>(() => (
    [...occurrences]
      .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
      .slice(0, 5)
      .map((occurrence) => {
        const status = getStatusPresentation(occurrence.status);
        return {
          id: occurrence.id,
          description: occurrence.description || occurrence.machineName,
          date: formatDate(occurrence.createdAt),
          priorityText: statusLabel(occurrence.priority),
          priorityStatus: getPriorityType(occurrence.priority),
          statusText: status.label,
          statusType: status.color,
        };
      })
  ), [occurrences]);

  const quickActions: ActionCardProps[] = [
    { label: "Máquinas", href: "/maquinas", icon: MonitorCog, desc: "Status e catálogo de equipamentos" },
    { label: "Ocorrências", href: "/ocorrencias", icon: MessageSquareWarning, desc: "Registrar e gerenciar chamados" },
    { label: "Compras", href: "/compras", icon: ShoppingCart, desc: "Solicitação de peças e insumos" },
    { label: "Alunos", href: "/alunos", icon: GraduationCap, desc: "Gestão e presença de alunos" },
    { label: "Turmas", href: "/turmas", icon: Users, desc: "Alocação dos laboratórios" },
  ];

  const columns: Column<OccurrenceHome>[] = [
    {
      header: "Código",
      accessor: (item) => (
        <span className="whitespace-nowrap text-xs font-semibold text-weg-blue" title={item.id}>
          #{item.id.slice(0, 8).toUpperCase()}
        </span>
      ),
      className: "w-28 align-middle whitespace-nowrap",
    },
    {
      header: "Descrição",
      accessor: (item) => (
        <span className="block min-w-0 break-words text-left text-sm font-semibold leading-5 text-gray-800">
          {item.description}
        </span>
      ),
      className: "min-w-52 align-middle text-left",
    },
    { header: "Data", accessor: "date", className: "w-32 align-middle whitespace-nowrap text-xs text-gray-400" },
    {
      header: "Prioridade",
      accessor: (item) => <LabelWithCircle text={item.priorityText} status={item.priorityStatus} />,
      className: "align-middle whitespace-nowrap",
    },
    {
      header: "Status",
      accessor: (item) => <LabelWithCircle text={item.statusText} status={item.statusType} />,
      className: "align-middle whitespace-nowrap",
    },
  ];

  return (
    <LayoutDesktop>
      <div className="grid grid-cols-1 items-start gap-6 pb-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Bem-vindo de volta, {user?.name ?? "usuário"}!
            </h1>
            <p className="text-sm text-gray-500">
              Aqui está o resumo geral das operações e manutenções da oficina.
            </p>
          </div>

          {error ? <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </section>

          <section className="flex w-full flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-weg-blue">Ocorrências recentes</h2>
                <p className="mt-0.5 text-xs text-gray-400">Últimos apontamentos de manutenção no portal</p>
              </div>
              <Link href="/ocorrencias" className="rounded-lg p-1.5 text-weg-blue transition-colors hover:bg-weg-blue/10" title="Ver todas as ocorrências">
                <Link2 className="h-5 w-5" />
              </Link>
            </div>

            <Table
              columns={columns}
              data={recentOccurrences}
              emptyMessage={loading ? "Carregando ocorrências..." : "Nenhuma ocorrência encontrada."}
              variant="plain"
            />
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="flex flex-col justify-between pb-[0.8rem]">
            <h2 className="text-xl font-bold text-gray-800">Links rápidos</h2>
            <span className="text-xs text-gray-400">Atalhos</span>
          </div>

          <section className="flex flex-col gap-3">
            {quickActions.map((action) => <ActionCard key={action.href} {...action} />)}
          </section>

          <Link href={notification ? `/notificacoes/${notification.id}` : "/notificacoes"} className="rounded-lg border border-blue-100 bg-blue-50/60 p-4 transition-colors hover:bg-blue-50">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-weg-blue" />
              <div className="text-xs">
                <p className="font-semibold text-gray-800">{notification?.title ?? "Notificações"}</p>
                <p className="mt-0.5 text-gray-500">
                  {loading ? "Carregando notificações..." : notification?.description ?? "Você não possui notificações no momento."}
                </p>
              </div>
            </div>
          </Link>
        </aside>
      </div>
    </LayoutDesktop>
  );
}
