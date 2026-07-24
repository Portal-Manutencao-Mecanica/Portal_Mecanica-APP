"use client";

import { useState } from "react";
import {
  MonitorCog,
  MessageSquareWarning,
  ShoppingCart,
  Users,
  PanelLeftOpen,
  GraduationCap,
  X,
  Settings,
  CircleQuestionMark,
} from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/atoms/UserAvatar";
import { User } from "@/props/UserAvatarProps";

interface SideBarProps {
  isMobileMenuOpen?: boolean;
  closeMobileMenu?: () => void;
}

export function SideBar({
  isMobileMenuOpen = false,
  closeMobileMenu,
}: SideBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentUser: User = {
    name: "Alexandre Santos",
    role: "Administrador",
  };

  const menuItems = [
    { icon: MonitorCog, label: "Máquinas", href: "/maquinas" },
    { icon: MessageSquareWarning, label: "Ocorrências", href: "/ocorrencias" },
    { icon: ShoppingCart, label: "Compras", href: "/compras" },
    { icon: GraduationCap, label: "Alunos", href: "/alunos" },
    { icon: Users, label: "Turmas", href: "/turmas" },
  ];

  return (
    <>
      {/* Overlay escuro no Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Principal */}
      <aside
        className={`
          bg-weg-blue text-white flex-col justify-between 
          transition-all duration-300 ease-in-out select-none overflow-hidden p-3
          
          /* Oculta no mobile quando fechado, desliza quando aberto */
          ${
            isMobileMenuOpen
              ? "flex fixed inset-y-0 left-0 z-50 h-full w-64 translate-x-0 shadow-2xl shadow-black/50"
              : "hidden -translate-x-full"
          }
          
          /* Layout Desktop */
          md:flex md:relative md:translate-x-0 md:z-20
          ${isExpanded ? "md:w-64 md:shadow-2xl md:shadow-black/40" : "md:w-20"}
        `}
      >
        <nav className="flex flex-col gap-2 w-full overflow-y-auto">
          {/* Botão Superior: Fechar (Mobile) / Expanding (Desktop) */}
          <button
            onClick={() => {
              if (isMobileMenuOpen && closeMobileMenu) {
                closeMobileMenu();
              } else {
                setIsExpanded(!isExpanded);
              }
            }}
            className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3 w-full"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 " >
              <X className="w-6 h-6 md:hidden" />
              <PanelLeftOpen
                className={`hidden md:block w-6 h-6 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            <span
              className={`
                whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden text-sm font-medium
                block opacity-100 max-w-xs ml-3
                ${
                  isExpanded
                    ? "md:opacity-100 md:max-w-xs md:ml-3"
                    : "md:opacity-0 md:max-w-0 md:ml-0 md:pointer-events-none"
                }
              `}
            >
              <span className="md:hidden">Fechar Menu</span>
              <span className="hidden md:inline">
                {isExpanded ? "Fechar Menu" : ""}
              </span>
            </span>
          </button>
              <div className="border-t border-white/10 md:border-transparent"></div>
          {/* Links Principais */}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={closeMobileMenu}
                className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3 w-full"
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`
                    whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden text-sm font-medium
                    block opacity-100 max-w-xs ml-3
                    ${
                      isExpanded
                        ? "md:opacity-100 md:max-w-xs md:ml-3"
                        : "md:opacity-0 md:max-w-0 md:ml-0 md:pointer-events-none"
                    }
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* ITEM EXCLUSIVO DO MOBILE: CONFIGURAÇÕES */}
          <div className="md:hidden flex flex-col gap-2 mt-2">
            <div className="h-px bg-white/20 my-1 w-full" />
            <Link
              href="/configuracoes"
              onClick={closeMobileMenu}
              className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3 w-full"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <span className="whitespace-nowrap text-sm font-medium ml-3">
                Configurações
              </span>
            </Link>

            <Link
              href="/ajuda"
              onClick={closeMobileMenu}
              className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3 w-full"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <CircleQuestionMark className="w-6 h-6" />
              </div>
              <span className="whitespace-nowrap text-sm font-medium ml-3">
                Ajuda
              </span>
            </Link>
          </div>
        </nav>

        {/* Perfil no Rodapé */}
        <div className="pt-3 mt-auto flex items-center border-t border-white/10 md:border-transparent">
          <UserAvatar
            user={currentUser}
            isExpanded={isExpanded || isMobileMenuOpen}
          />
        </div>
      </aside>
    </>
  );
}