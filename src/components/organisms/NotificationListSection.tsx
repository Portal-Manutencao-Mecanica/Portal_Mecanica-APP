"use client";

import { useMemo, useState } from "react";
import { CheckCheck, Eye } from "lucide-react";
import Button from "@/components/atoms/Button";
import PageHeader from "@/components/molecules/PageHeader";
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
    { header: "Assunto", render: (notification) => notification.about ?? "-" },
    { header: "Situação", render: (notification) => notification.statusRead ? "Lida" : "Não lida" },
    { header: "", align: "right", render: (notification) => <Button href={`/notificacoes/${notification.id}`} variant="secondary" icon={Eye} iconOnly aria-label={`Visualizar notificação: ${notification.title}`} title="Visualizar notificação" /> },
  ], []);

  return <div className="space-y-6">
    <PageHeader title="Todas as notificações" description="Gerencie e visualize seu histórico de alertas." actions={unreadCount > 0 && onMarkAllAsRead ? <Button variant="secondary" icon={CheckCheck} onClick={onMarkAllAsRead}>Marcar todas como lidas</Button> : undefined} />
    <div className="flex flex-wrap gap-3"><Button variant={filter === "ALL" ? "primary" : "secondary"} onClick={() => setFilter("ALL")}>Todas ({notifications.length})</Button><Button variant={filter === "UNREAD" ? "primary" : "secondary"} onClick={() => setFilter("UNREAD")}>Não lidas ({unreadCount})</Button></div>
    <DataTable data={filteredNotifications} columns={columns} searchKeys={["title", "about", "email"]} searchPlaceholder="Pesquisar notificações..." emptyMessage="Nenhuma notificação encontrada." />
  </div>;
}
