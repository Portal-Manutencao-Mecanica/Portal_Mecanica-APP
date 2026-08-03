"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCheck, Eye } from "lucide-react";

import Button from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import type { ColumnProps } from "@/props/ColumnProps";
import type { NotificationData } from "@/props/NotificationDetailProps";

interface NotificationListSectionProps { notifications: NotificationData[]; onMarkAllAsRead?: () => void; }

export default function NotificationListSection({ notifications, onMarkAllAsRead }: NotificationListSectionProps) {
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const unreadCount = notifications.filter((notification) => !notification.statusRead).length;
  const filteredNotifications = filter === "UNREAD" ? notifications.filter((notification) => !notification.statusRead) : notifications;
  const columns = useMemo<ColumnProps<NotificationData>[]>(() => [
    { header: "Título", accessorKey: "title" },
    { header: "Assunto", accessorKey: "about" },
    { header: "Situação", render: (notification) => notification.statusRead ? "Lida" : "Não lida" },
    { header: "Ações", align: "right", render: (notification) => <Link href={`/notificacoes/${notification.id}`}><Button variant="secondary" icon={Eye}>Visualizar</Button></Link> },
  ], []);
  return <div className="mx-auto max-w-7xl space-y-6"><div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Todas as notificações</h1><p className="mt-1 text-sm text-gray-500">Gerencie e visualize seu histórico de alertas.</p></div>{unreadCount > 0 && onMarkAllAsRead && <Button variant="secondary" icon={CheckCheck} onClick={onMarkAllAsRead}>Marcar todas como lidas</Button>}</div><div className="flex gap-3"><Button variant={filter === "ALL" ? "primary" : "secondary"} onClick={() => setFilter("ALL")}>Todas ({notifications.length})</Button><Button variant={filter === "UNREAD" ? "primary" : "secondary"} onClick={() => setFilter("UNREAD")}>Não lidas ({unreadCount})</Button></div><DataTable data={filteredNotifications} columns={columns} searchKeys={["title", "about", "email"]} searchPlaceholder="Pesquisar notificações..." emptyMessage="Nenhuma notificação encontrada." /></div>;
}
