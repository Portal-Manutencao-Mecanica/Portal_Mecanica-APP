"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageFeedback from "@/components/molecules/PageFeedback";
import Pagination from "@/components/molecules/Pagination";
import NotificationListSection from "@/components/organisms/NotificationListSection";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Page } from "@/lib/api/types";
import type { NotificationData } from "@/props/NotificationDetailProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { notificationService } from "@/services/notificationService";

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const [notificationPage, setNotificationPage] = useState<Page<NotificationData> | null>(null);
  const [page, setPage] = useState(0);
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const requestKey = String(page);
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    notificationService
      .list(page, PAGE_SIZE)
      .then((result) => {
        if (active) {
          setNotificationPage(result);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            getServiceErrorMessage(
              loadError,
              "Não foi possível carregar as notificações.",
            ),
          );
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [page, requestKey]);

  async function markAll() {
    try {
      await notificationService.markAllAsRead();
      setNotificationPage((current) => current
        ? {
            ...current,
            content: current.content.map((item) => ({ ...item, statusRead: true })),
          }
        : current);
      toast.success("Todas as notificações foram marcadas como lidas.");
    } catch (markError) {
      toast.error(
        getServiceErrorMessage(markError, "Não foi possível atualizar as notificações."),
      );
    }
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        {loading ? (
          <PageFeedback message="Carregando notificações..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <>
            <NotificationListSection
              notifications={notificationPage?.content ?? []}
              onMarkAllAsRead={markAll}
            />
            <Pagination
              page={notificationPage?.number ?? page}
              totalPages={notificationPage?.totalPages ?? 0}
              totalElements={notificationPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}
