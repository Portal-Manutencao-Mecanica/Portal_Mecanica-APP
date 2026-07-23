"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";
import Button from "@/components/atoms/Button";
import NotificationItem from "@/components/atoms/NotificationItem"; 
import { NotificationData } from "@/props/NotificationDetailProps";

interface NotificationListSectionProps {
  notifications: NotificationData[];
  onMarkAllAsRead?: () => void;
}

export default function NotificationListSection({
  notifications,
  onMarkAllAsRead,
}: NotificationListSectionProps) {
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  // Filtra as notificações conforme a aba selecionada
  const filteredNotifications = notifications.filter((item) => {
    if (filter === "UNREAD") return !item.statusRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.statusRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Todas as Notificações
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie e visualize seu histórico de alertas
          </p>
        </div>

        {unreadCount > 0 && onMarkAllAsRead && (
          <div className="flex items-center">
            <Button
              variant="secondary"
              onClick={onMarkAllAsRead}
              className="flex items-center gap-2 text-xs border-weg-blue/30 text-weg-blue hover:bg-weg-blue/10 transition-colors py-2 px-3.5 rounded-lg font-medium"
            >
              <CheckCheck size={16} className="text-weg-blue" />
              <span>Marcar todas como lidas</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200 text-sm font-medium">
        <button
          onClick={() => setFilter("ALL")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            filter === "ALL"
              ? "border-weg-blue text-weg-blue font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Todas</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-normal">
            {notifications.length}
          </span>
        </button>

        <button
          onClick={() => setFilter("UNREAD")}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            filter === "UNREAD"
              ? "border-weg-blue text-weg-blue font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Não lidas</span>
          {unreadCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-weg-negative/20 text-weg-negative font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Nenhuma notificação encontrada nesta aba.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              id={notif.id}
              title={notif.title}
              about={notif.about}
              isUnread={!notif.statusRead}
            />
          ))
        )}
      </div>

    </div>
  );
}