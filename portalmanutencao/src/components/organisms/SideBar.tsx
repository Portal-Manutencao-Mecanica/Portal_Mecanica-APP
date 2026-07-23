"use client";

import { useState } from "react";
import {
  MonitorCog,
  MessageSquareWarning,
  ShoppingCart,
  Users,
  PanelLeftOpen,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/atoms/UserAvatar";
import { User } from "@/props/UserAvatarProps";

export function SideBar() {
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
    <div className="w-20 shrink-0 h-full relative z-20">
      <aside
        className={`
          absolute top-0 left-0 h-full bg-weg-blue text-white flex flex-col justify-between 
          transition-[width] duration-300 ease-in-out select-none overflow-hidden p-3
          ${isExpanded ? "w-64 shadow-2xl shadow-black/40" : "w-20"}
        `}
      >
        <nav className="flex flex-col gap-4 w-full">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <PanelLeftOpen
                className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>
            <span
              className={`whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${isExpanded
                  ? "opacity-100 max-w-xs ml-4"
                  : "opacity-0 max-w-0 ml-0 pointer-events-none"
                }`}
            >
              Fechar Menu
            </span>
          </button>

          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3"
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${isExpanded
                      ? "opacity-100 max-w-xs ml-4"
                      : "opacity-0 max-w-0 ml-0 pointer-events-none"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-3 mt-auto">
          <UserAvatar user={currentUser} isExpanded={isExpanded} />
        </div>
      </aside>
    </div>
  );
}