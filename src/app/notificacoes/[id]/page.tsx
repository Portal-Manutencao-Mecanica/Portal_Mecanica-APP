"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import NotificationDetailSection from "@/components/organisms/NotificationDetailSection";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { NotificationData } from "@/props/NotificationDetailProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { notificationService } from "@/services/notificationService";

export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotification() {
      try {
        const current = await notificationService.getById(id);
        const updated = current.statusRead ? current : await notificationService.markAsRead(current.id);
        setNotification(updated);
      } catch (error) {
        toast.error(getServiceErrorMessage(error, "Não foi possível carregar a notificação."));
      } finally {
        setLoading(false);
      }
    }

    void loadNotification();
  }, [id]);

  async function toggleRead() {
    if (!notification) return;

    try {
      const updated = await notificationService.toggleRead(notification.id);
      setNotification(updated);
      toast.success(updated.statusRead ? "Notificação marcada como lida." : "Notificação marcada como não lida.");
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível atualizar a notificação."));
    }
  }

  return (
    <LayoutDesktop>
      <div className="space-y-5 p-4 md:p-8">
        <Link href="/notificacoes">
          <Button variant="secondary" icon={ArrowLeft}>Voltar para notificações</Button>
        </Link>
        {loading && <p className="text-center text-gray-500">Carregando notificação...</p>}
        {!loading && !notification && <p className="text-center text-gray-500">Notificação não encontrada.</p>}
        {notification && <NotificationDetailSection notification={notification} onMarkAsRead={toggleRead} />}
      </div>
    </LayoutDesktop>
  );
}
