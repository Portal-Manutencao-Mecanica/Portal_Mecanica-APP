"use client";

import { useEffect, useState } from "react";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import NotificationListSection from "@/components/organisms/NotificationListSection";
import { NotificationData } from "@/props/NotificationDetailProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { notificationService } from "@/services/notificationService";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    notificationService.list()
      .then(setNotifications)
      .catch((loadError: unknown) => {
        setError(getServiceErrorMessage(loadError, "Falha ao carregar notificações."));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleMarkAllAsRead = async () => {
    const previousNotifications = notifications;
    setNotifications((current) =>
      current.map((item) => ({ ...item, statusRead: true })),
    );

    try {
      await notificationService.markAllAsRead();
    } catch (updateError) {
      setNotifications(previousNotifications);
      setError(getServiceErrorMessage(updateError, "Falha ao atualizar notificações."));
    }
  };

  return (
    <LayoutDesktop>
      <div className="p-4 md:p-8">
        {isLoading && <p className="text-gray-500">Carregando notificações...</p>}
        {error && <p className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
        <NotificationListSection
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </div>
    </LayoutDesktop>
  );
}
