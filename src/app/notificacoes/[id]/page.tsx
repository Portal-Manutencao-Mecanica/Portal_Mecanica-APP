"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import NotificationDetailSection from "@/components/organisms/NotificationDetailSection";
import type { Notification } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { notificationService } from "@/services/notificationService";

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    notificationService
      .getById(id)
      .then(setNotification)
      .catch((error) =>
        toast.error(
          getServiceErrorMessage(error, "Não foi possível carregar a notificação."),
        ),
      )
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleToggleRead() {
    if (!notification) return;
    try {
      setNotification(await notificationService.toggleRead(notification.id));
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível atualizar a notificação."),
      );
    }
  }

  if (isLoading || !notification) {
    return (
      <LayoutDesktop>
        <p className="p-8 text-center text-sm text-gray-500">
          {isLoading ? "Carregando notificação..." : "Notificação não encontrada."}
        </p>
      </LayoutDesktop>
    );
  }

  return (
    <LayoutDesktop>
      <div className="p-4 md:p-8">
        <NotificationDetailSection
          notification={notification}
          onMarkAsRead={() => void handleToggleRead()}
        />
      </div>
    </LayoutDesktop>
  );
}
