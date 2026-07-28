'use client'
import { useState } from 'react';
import { MonitorCog, MessageSquareWarning, ShoppingCart, Users, PanelLeftOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export function SideBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: MonitorCog, label: "Maquinas", href: "/maquinas" },
    { icon: MessageSquareWarning, label: "Ocorrências", href: "/ocorrencias" },
    { icon: ShoppingCart, label: "Compras", href: "/compras" },
    { icon: GraduationCap, label: "Alunos", href: "/alunos" },
    { icon: Users, label: "Turmas", href: "/turmas" },
  ];

  return (
    <aside
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        h-full bg-weg-blue text-white flex flex-col gap-6 cursor-pointer
        transition-all duration-300 ease-in-out select-none 
        ${isExpanded ? 'w-64 p-4' : 'w-20 py-4 px-2'}
      `}
    >
      <nav className="flex flex-col gap-4 w-full">

        {/* Botão Fechar / Abrir Menu */}
        <a
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center h-12 px-3 rounded-lg transition-colors hover:bg-white/10
            ${isExpanded ? 'justify-start gap-4' : 'justify-center'}
          `}
        >
          <PanelLeftOpen
            className={`w-6 h-6 shrink-0 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
          />
          {isExpanded && (
            <span className="whitespace-nowrap transition-opacity duration-200 opacity-100">
              Fechar Menu
            </span>
          )}
        </a>

        {/* Itens do Menu */}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className={`
                flex items-center h-12 px-3 rounded-lg transition-colors hover:bg-white/10 cursor-pointer
                ${isExpanded ? 'justify-start gap-4' : 'justify-center'}
              `}
            >
              <Icon className="w-6 h-6 shrink-0" />

              {/* Renderiza o texto APENAS quando expandido. 
                  Isso elimina o gap invisível e garante o ícone 100% centralizado! */}
              {isExpanded && (
                <span className="whitespace-nowrap transition-opacity duration-200 opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}