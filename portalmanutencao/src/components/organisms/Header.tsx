"use client";

import { CircleQuestionMark, Bell, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import NotificationItem from "@/components/atoms/NotificationItem";

export default function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Ocorrência Aprovada",
      about: "A ocorrência do Professor Manutenção foi validada.",
      isUnread: true,
    },
    {
      id: 2,
      title: "Sistema Atualizado",
      about: "O portal recebeu uma nova versão hoje.",
      isUnread: false,
    },
    {
      id: 3,
      title: "Manutenção Concluída",
      about: "Máquina Torno CNC liberada para uso.",
      isUnread: true,
    },
  ]);

  const hasUnreadNotifications = notifications.some((notif) => notif.isUnread);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleMenu = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className="bg-weg-blue w-full py-6 px-5 shadow-lg shadow-black/30 relative z-30">
      <nav className="max-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          aria-label="Ir para a página inicial"
          className="flex items-center"
        >
          <Image
            src="/brand/logo-icon.svg"
            alt="WEG logo"
            width={39}
            height={25}
            priority
          />
        </Link>

        <h1 className="text-3xl text-white font-semibold">
          Portal da Manutenção
        </h1>

        <div>
          <ul className="flex items-center gap-4">
            <li>
              <button
                className="transition-colors hover:bg-white/10 h-12 w-12 flex justify-center items-center rounded-lg cursor-pointer"
                aria-label="Ajuda"
              >
                <CircleQuestionMark color="white" size={24} />
              </button>
            </li>

            <li ref={dropdownRef} className="relative">
              <button
                onClick={handleToggleMenu}
                className={`relative transition-colors hover:bg-white/10 h-12 w-12 flex justify-center items-center rounded-lg cursor-pointer ${
                  isNotificationOpen ? "bg-white/20" : "hover:bg-white/10"
                }`}
                aria-label="Notificações"
              >
                <Bell color="white" size={24} />

                {hasUnreadNotifications && (
                  <span className="absolute top-2.5 right-2.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-weg-blue"></span>
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#FAFAFA] text-weg-blue rounded-lg shadow-2xl border border-weg-blue z-50 flex flex-col">
                  <div className="px-4 pt-3 py-2 text-xs font-bold text-weg-blue uppercase tracking-wider mb-1 flex justify-between items-center">
                    <span>Notificações Recentes</span>
                  </div>

                  <div className="max-h-75 overflow-y-auto">
                    {notifications.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        title={notif.title}
                        about={notif.about}
                        isUnread={notif.isUnread}
                        onClick={() =>
                          console.log(`Clicou na notificação ${notif.id}`)
                        }
                        id={""}
                      />
                    ))}
                  </div>

                  <div className="h-px bg-weg-blue/30 my-1" />

                  <Link
                    href="/notificacoes"
                    onClick={() => setIsNotificationOpen(false)}
                    className="group px-4 py-2.5 hover:bg-weg-blue/85 hover:text-[#FAFAFA] rounded-b-md cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span className="text-sm font-medium">
                      Ver todas as notificações
                    </span>
                  </Link>
                </div>
              )}
            </li>

            <li>
              <button
                className="transition-colors hover:bg-white/10 h-12 w-12 flex justify-center items-center rounded-lg cursor-pointer"
                aria-label="Configurações"
              >
                <Settings color="white" size={24} />
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
