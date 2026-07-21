'use client'
import { useState } from 'react';
import { MonitorCog, MessageSquareWarning, ShoppingCart, Users, PanelLeftOpen } from 'lucide-react';

export function SideBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: MonitorCog, label: 'Maquinas', href: '/maquinas' },
    { icon: MessageSquareWarning, label: 'Ocorrências', href: '/ocorrencias' },
    { icon: ShoppingCart, label: 'Compras', href: '/compras' },
    { icon: Users, label: 'Alunos', href: '/alunos' },
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

        <a
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
                flex items-center gap-4 h-12 rounded-lg transition-colors hover:bg-white/10
                ${isExpanded ? 'px-3 justify-start' : 'justify-center'}
              `}
        >
          <PanelLeftOpen
            className={`w-6 h-6 shrink-0 transition-transform duration-300
              ${isExpanded ? 'rotate-180' : 'rotate-0'}`}

          />

          {isExpanded && (
            <span className="whitespace-nowrap transition-opacity duration-200 opacity-100">
              Fechar Menu
            </span>
          )}
        </a>


        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              onClick={(e) => e.stopPropagation()}
              className={`
                flex items-center gap-4 h-12 rounded-lg transition-colors hover:bg-white/10
                ${isExpanded ? 'px-3 justify-start' : 'justify-center'}
              `}
            >
              <Icon className="w-6 h-6 shrink-0" />

              {isExpanded && (
                <span className="whitespace-nowrap transition-opacity duration-200 opacity-100">
                  {item.label}
                </span>
              )}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}