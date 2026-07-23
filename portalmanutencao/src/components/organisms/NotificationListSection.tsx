"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/atoms/Button";
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

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "UNREAD") return !item.statusRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.statusRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Cabeçalho com Filtros e Ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Todas as Notificações
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Você tem <strong className="text-gray-800">{unreadCount}</strong> {unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button variant="secondary" onClick={onMarkAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {/* Tabs / Filtro de Exibição */}
      <div className="flex border-b border-gray-200 gap-6 text-sm font-medium">
        <button
          onClick={() => setFilter("ALL")}
          className={`pb-2 border-b-2 transition-colors cursor-pointer ${
            filter === "ALL"
              ? "border-[#00579D] text-[#00579D]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`pb-2 border-b-2 transition-colors cursor-pointer ${
            filter === "UNREAD"
              ? "border-[#00579D] text-[#00579D]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Não Lidas ({unreadCount})
        </button>
      </div>

      {/* Lista de Notificações */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Nenhuma notificação encontrada.
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <Link
              key={item.id}
              href={`/notificacoes/${item.id}`}
              className="group p-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors block"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!item.statusRead && (
                    <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
                  )}
                  <h3
                    className={`text-base ${
                      !item.statusRead
                        ? "font-bold text-[#00579D]"
                        : "font-medium text-gray-900"
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>
                
                {item.about && (
                  <p className="text-sm text-gray-600 pl-4">
                    {item.about}
                  </p>
                )}

                <p className="text-xs text-gray-400 pl-4 pt-1">
                  Para: {item.email}
                </p>
              </div>

              <div className="text-xs font-medium text-gray-400 group-hover:text-[#00579D] flex items-center gap-1 flex-shrink-0 pt-1">
                Ver detalhes &rarr;
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}