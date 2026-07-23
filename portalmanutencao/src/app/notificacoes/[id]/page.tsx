"use client";

import { use, useState } from "react";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import NotificationDetailSection from "@/components/organisms/NotificationDetailSection";
import { NotificationData } from "@/props/NotificationDetailProps";

const mockNotification: NotificationData = {
  id: 1,
  email: "usuario@weg.net",
  title: "Ocorrência Aprovada",
  about: "A ocorrência do Professor Manutenção foi validada.",
  description: `Sua ocorrência registrada para a máquina Torno CNC foi avaliada e devidamente aprovada pelo setor responsável.\n\nAs medidas necessárias para o processo de manutenção preventiva já foram encaminhadas para a equipe técnica. Não é necessária nenhuma ação adicional no momento.`,
  statusRead: false,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotificationPage({ params }: PageProps) {
  const { id } = use(params);
  const [notification, setNotification] =
    useState<NotificationData>(mockNotification);

  const handleMarkAsRead = () => {
    // Chamada à API Spring Boot no futuro
    setNotification((prev) => ({ ...prev, statusRead: true }));
  };

  return (
    <LayoutDesktop>
      <div className="p-4 md:p-8">
        <NotificationDetailSection
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
    </LayoutDesktop>
  );
}
