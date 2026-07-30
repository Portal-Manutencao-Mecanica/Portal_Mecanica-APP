"use client";

import { useState } from "react";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import NotificationListSection from "@/components/organisms/NotificationListSection";
import { NotificationData } from "@/props/NotificationDetailProps";

// Mock de notificações vindas da API Spring Boot
const mockNotificationsList: NotificationData[] = [
  {
    id: 1,
    email: "usuario@weg.net",
    title: "Ocorrência Aprovada",
    about: "A ocorrência do Professor Manutenção foi validada.",
    description: "A ocorrência #123 foi validada e aprovada para execução.",
    statusRead: false,
  },
  {
    id: 2,
    email: "usuario@weg.net",
    title: "Sistema Atualizado",
    about: "O portal recebeu uma nova versão hoje.",
    description: "Versão 2.1 liberada com correções de erros e melhorias de performance.",
    statusRead: true,
  },
  {
    id: 3,
    email: "usuario@weg.net",
    title: "Manutenção Concluída",
    about: "Máquina Torno CNC liberada para uso.",
    description: "A manutenção preventiva no Torno CNC foi finalizada com sucesso.",
    statusRead: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>(mockNotificationsList);

  const handleMarkAllAsRead = () => {
    // Aqui você chama a API do Spring Boot para dar flush em statusRead = true
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, statusRead: true }))
    );
  };

  return (
    <LayoutDesktop>
      <div className="p-4 md:p-8">
        <NotificationListSection
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      </div>
    </LayoutDesktop>
  );
}