"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageFeedback from "@/components/molecules/PageFeedback";
import NotificationListSection from "@/components/organisms/NotificationListSection";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { NotificationData } from "@/props/NotificationDetailProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { notificationService } from "@/services/notificationService";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { notificationService.list().then((page) => setNotifications(page.content)).catch((error) => toast.error(getServiceErrorMessage(error, "Não foi possível carregar as notificações."))).finally(() => setLoading(false)); }, []);
  async function markAll() { try { await notificationService.markAllAsRead(); setNotifications((current) => current.map((item) => ({ ...item, statusRead: true }))); toast.success("Todas as notificações foram marcadas como lidas."); } catch (error) { toast.error(getServiceErrorMessage(error, "Não foi possível atualizar as notificações.")); } }
  return <LayoutDesktop><div className="space-y-6">{loading ? <PageFeedback message="Carregando notificações..." /> : <NotificationListSection notifications={notifications} onMarkAllAsRead={markAll} />}</div></LayoutDesktop>;
}
