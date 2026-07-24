"use client";

import { Bell, Settings, Menu, CircleQuestionMark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import NotificationItem from "@/components/atoms/NotificationItem";
import { HeaderProps } from "@/props/HeaderProps";
import { User } from "@/props/UserAvatarProps";
import { UserAvatar } from "../atoms/UserAvatar";

export default function Header({ onOpenMobileMenu }: HeaderProps) {
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

  const currentUser: User = {
    name: "Alexandre Santos",
    role: "Administrador",
  };

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
    <header className="bg-weg-blue w-full py-4 md:py-6 px-3 sm:px-5 shadow-lg shadow-black/30 relative z-30">
      <nav className="w-full mx-auto flex items-center justify-between gap-2">
        {/* Lado Esquerdo: Hambúrguer (Mobile) + Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden transition-colors hover:bg-white/10 h-10 w-10 flex justify-center items-center rounded-lg cursor-pointer text-white"
            aria-label="Abrir Menu Lateral"
          >
            <Menu size={24} />
          </button>

          <Link
            href="/"
            aria-label="Ir para a página inicial"
            className="flex items-center shrink-0"
          >
            <Image
              src="/brand/logo-icon.svg"
              alt="WEG logo"
              width={35}
              height={22}
              priority
            />
          </Link>
        </div>

        {/* Título Principal: Ajustado o tamanho da fonte para não quebrar em telas pequenas */}
        <h1 className="text-base sm:text-xl md:text-3xl text-white font-semibold text-center whitespace-nowrap">
          Portal da Manutenção
        </h1>

        {/* Lado Direito: Notificações + Configurações (Apenas Desktop) */}
        <div className="shrink-0">
          <ul className="flex items-center gap-1 md:gap-4">
            <li className="hidden sm:block">
              <UserAvatar user={currentUser} />
            </li>

            {/* Notificações (Mobile e Desktop) */}
            <li ref={dropdownRef} className="relative">
              <button
                onClick={handleToggleMenu}
                className={`relative transition-colors hover:bg-white/10 h-10 w-10 md:h-12 md:w-12 flex justify-center items-center rounded-lg cursor-pointer ${
                  isNotificationOpen ? "bg-white/20" : "hover:bg-white/10"
                }`}
                aria-label="Notificações"
              >
                <Bell color="white" size={22} />

                {hasUnreadNotifications && (
                  <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-weg-blue"></span>
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#FAFAFA] text-weg-blue rounded-lg shadow-2xl border border-weg-blue z-50 flex flex-col">
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

            {/* Engrenagem: ESCONDIDA NO MOBILE (hidden), VISÍVEL APENAS NO DESKTOP (md:flex) */}

            <li className="hidden md:flex">
              <Link
                className="transition-colors hover:bg-white/10 h-10 w-10 md:h-12 md:w-12 flex justify-center items-center rounded-lg cursor-pointer"
                aria-label="Configurações" href={"/ajuda"}>
                <CircleQuestionMark color="white" size={22} />
              </Link>
            </li>

            <li className="hidden md:flex">
              <Link
                className="transition-colors hover:bg-white/10 h-10 w-10 md:h-12 md:w-12 flex justify-center items-center rounded-lg cursor-pointer"
                aria-label="Configurações" href={"/configuracoes"}>
                <Settings color="white" size={22} />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}