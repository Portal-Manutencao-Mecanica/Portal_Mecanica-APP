"use client";

import { Bell, CircleQuestionMark, Menu, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import NotificationItem from "@/components/atoms/NotificationItem";
import type { Notification } from "@/lib/api/types";
import { notificationService } from "@/services/notificationService";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const loadNotifications = useCallback(async () => {
    try {
      const [page, count] = await Promise.all([
        notificationService.list(0, 5),
        notificationService.unreadCount(),
      ]);
      setNotifications(page.content);
      setUnreadCount(count);
    } catch {
      // The layout can briefly render while the session is being replaced.
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    async function loadInitialNotifications() {
      await loadNotifications();
    }

    void loadInitialNotifications();
    function handleNotificationChange() {
      void loadNotifications();
    }

    window.addEventListener("notifications:changed", handleNotificationChange);
    return () => window.removeEventListener("notifications:changed", handleNotificationChange);
  }, [loadNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggleMenu() {
    setIsNotificationOpen((current) => {
      const willOpen = !current;
      if (willOpen) void loadNotifications();
      return willOpen;
    });
  }

  return (
    <header className="relative z-30 flex h-16 w-full shrink-0 items-center bg-weg-blue px-4 shadow-md md:h-20 md:px-5">
      <nav className="relative flex w-full items-center justify-between gap-2 md:gap-4">
        <div className="z-10 flex shrink-0 items-center gap-2">
          <button
            onClick={onOpenMobileMenu}
            className="cursor-pointer rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/" aria-label="Ir para a página inicial" className="hidden shrink-0 items-center sm:flex">
            <Image src="/brand/logo-icon.svg" alt="WEG logo" width={39} height={25} priority />
          </Link>
        </div>

        <h1 className="pointer-events-none absolute left-1/2 max-w-[50%] -translate-x-1/2 truncate text-center text-base font-semibold text-white sm:text-xl md:text-3xl">
          Portal da Manutenção
        </h1>

        <div className="z-10 shrink-0">
          <ul className="flex items-center gap-1 md:gap-4">
            <li className="hidden sm:block">
              <Link href="/faq">
                <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-white/10" aria-label="Ajuda">
                  <CircleQuestionMark color="white" size={24} />
                </button>
              </Link>
            </li>

            <li ref={dropdownRef} className="relative">
              <button
                onClick={handleToggleMenu}
                className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors md:h-12 md:w-12 ${isNotificationOpen ? "bg-white/20" : "hover:bg-white/10"}`}
                aria-label="Notificações"
                aria-expanded={isNotificationOpen}
              >
                <Bell color="white" size={24} />
                {unreadCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-weg-blue bg-red-500" />
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 flex w-72 flex-col rounded-lg border border-weg-blue bg-[#FAFAFA] text-weg-blue shadow-2xl sm:w-80">
                  <div className="mb-1 flex items-center justify-between px-4 py-2 pt-3 text-xs font-bold uppercase tracking-wider">
                    <span>Notificações recentes</span>
                    {unreadCount > 0 && <span>{unreadCount} não lida{unreadCount === 1 ? "" : "s"}</span>}
                  </div>
                  <div className="max-h-75 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-gray-500">Nenhuma notificação recente.</p>
                    ) : (
                      notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          id={notification.id}
                          title={notification.title}
                          about={notification.about}
                          isUnread={!notification.statusRead}
                          onClick={() => setIsNotificationOpen(false)}
                        />
                      ))
                    )}
                  </div>
                  <div className="my-1 h-px bg-weg-blue/30" />
                  <Link href="/notificacoes" onClick={() => setIsNotificationOpen(false)} className="flex cursor-pointer items-center justify-between rounded-b-md px-4 py-2.5 text-sm font-medium transition-colors hover:bg-weg-blue/85 hover:text-[#FAFAFA]">
                    Ver todas as notificações
                  </Link>
                </div>
              )}
            </li>

            <li className="hidden sm:block">
              <Link href="/configuracao">
                <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-white/10" aria-label="Configurações">
                  <Settings color="white" size={24} />
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
