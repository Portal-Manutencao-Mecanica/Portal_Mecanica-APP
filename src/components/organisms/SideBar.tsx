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
  Toolbox,
  Settings,
  CircleQuestionMark,
  BrushCleaning,
  Calendar,
  ClipboardCheck,
  BookOpen,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/atoms/UserAvatar";
import { SideBarProps } from "@/props/SideBarProps";
import { useAuth } from "@/hooks/useAuth";

export function SideBar({
  isMobileMenuOpen = false,
  closeMobileMenu,
}: SideBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { icon: BookOpen, label: "Material de apoio", href: "/maquinas/material-complementar" },
    { icon: MonitorCog, label: "Máquinas", href: "/maquinas" },
    { icon: MessageSquareWarning, label: "Ocorrências", href: "/ocorrencias" },
    { icon: ShoppingCart, label: "Compras", href: "/compras" },
    { icon: GraduationCap, label: "Alunos", href: "/alunos" },
    ...(user?.role === "ADMIN" || user?.role === "COORDENADOR"
      ? [{ icon: Building2, label: "Organizações", href: "/organizacoes" }]
      : []),
    ...(user?.role === "ADMIN" || user?.role === "COORDENADOR"
      ? [{ icon: Users, label: "Usuários", href: "/usuarios" }]
      : []),
    { icon: Users, label: "Turmas", href: "/turmas" },
    { icon: Toolbox, label: "Equipamentos", href: "/equipamentos" },
    { icon: BrushCleaning, label: "Inconveniência 5S", href: "/incoveniencia5s" },
    { icon: ClipboardCheck, label: "Manutenção Autônoma", href: "/manutencao-autonoma" },
    { icon: Calendar, label: "Calendário", href: "/calendario" },
  ];

  return (
    <>
      {/* 1. Overlay Escuro no Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* 2. Sidebar Container */}
      <aside
        className={`
          bg-weg-blue text-white flex flex-col justify-between 
          transition-[width] duration-300 ease-in-out select-none p-3 overflow-hidden

          /* Modo Mobile */
          fixed inset-y-0 left-0 z-50 w-64 ${
            isMobileMenuOpen
              ? "translate-x-0 shadow-2xl shadow-black/50"
              : "-translate-x-full"
          }

          /* Modo Desktop */
          md:relative md:translate-x-0 md:z-20 md:h-full
          ${isExpanded ? "md:w-64" : "md:w-20"}
        `}
      >
        <nav className="flex flex-col gap-1 w-full overflow-y-auto overflow-x-hidden flex-1">
          {/* Botão Superior: Fechar / Expandir */}
          <button
            onClick={() => {
              if (isMobileMenuOpen && closeMobileMenu) {
                closeMobileMenu();
              } else {
                setIsExpanded(!isExpanded);
              }
            }}
            className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer w-full shrink-0 px-3 justify-start"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <X className="w-6 h-6 md:hidden" />
              <PanelLeftOpen
                className={`hidden md:block w-6 h-6 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {/* Texto com transição suave de opacidade */}
            <span
              className={`
                whitespace-nowrap transition-opacity duration-200 text-sm font-medium ml-3
                ${
                  isExpanded
                    ? "opacity-100 delay-100"
                    : "opacity-100 md:opacity-0"
                }
              `}
            >
              <span className="md:hidden">Fechar Menu</span>
              <span className="hidden md:inline">Fechar Menu</span>
            </span>
          </button>

          <div className="border-t border-white/10 my-1 shrink-0 w-full" />

          {/* Links Principais */}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={closeMobileMenu}
                className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer w-full shrink-0 px-3 justify-start"
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Texto com transição suave de opacidade */}
                <span
                  className={`
                    whitespace-nowrap transition-opacity duration-200 text-sm font-medium ml-3
                    ${
                      isExpanded
                        ? "opacity-100 delay-100"
                        : "opacity-100 md:opacity-0"
                    }
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Itens Exclusivos de Mobile */}
          <div className="md:hidden flex flex-col gap-1 mt-1 pt-1 border-t border-white/20 shrink-0 w-full">
            <Link
              href="/configuracao"
              onClick={closeMobileMenu}
              className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3 w-full justify-start"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <span className="whitespace-nowrap text-sm font-medium ml-3">
                Configurações
              </span>
            </Link>

            <Link
              href="/faq"
              onClick={closeMobileMenu}
              className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3 w-full justify-start"
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
        <div className="flex items-center pt-2 shrink-0 border-t border-white/10 md:border-t-0 mt-1 w-full justify-start">
          <UserAvatar
            user={{
              name: user?.name ?? "Usuário",
              role: user?.role,
              email: user?.email,
            }}
            isExpanded={isExpanded || isMobileMenuOpen}
          />
        </div>
      </aside>
    </>
  );
}
