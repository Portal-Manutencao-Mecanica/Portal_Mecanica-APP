"use client";

import { useState } from "react";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import NotificationDetailSection from "@/components/organisms/NotificationDetailSection";

export default function NotificationDetailPage() {
  const [notification, setNotification] = useState({
    id: 1,
    email: "usuario@weg.net",
    title: "Ocorrência Aprovada",
    about: "A ocorrência do Professor Manutenção foi validada.",
    description: "A ocorrência #123 foi validada e aprovada para execução.",
    statusRead: false,
  });

  // Função para alternar (Toggle) entre Lida e Não Lida:
  const handleToggleRead = () => {
    setNotification((prev) => ({
      ...prev,
      statusRead: !prev.statusRead,
    }));
  };

  return (
    <LayoutDesktop>
      <div className="p-4 md:p-8">
        <NotificationDetailSection
          notification={notification}
          onMarkAsRead={handleToggleRead}
        />
      </div>
    </LayoutDesktop>
  );
}
