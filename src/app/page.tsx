"use client";

import Link from "next/link";
import { Link2, Bell, CheckCircle2 } from "lucide-react";

// Layout & Componentes
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { StatCard } from "@/components/atoms/StatCard";
import { ActionCard } from "@/components/molecules/ActionCard";
import { Table } from "@/components/organisms/Table";


// Props e Types
import { StatCardProps } from "@/props/StatCardProps";
import { ActionCardProps } from "@/props/ActionCardProps";
import { Column } from "@/props/TableProps";
import { LabelStatus } from "@/types/LabelStatus";

import {
  Wrench,
  AlertTriangle,
  Users,
  MonitorCog,
  MessageSquareWarning,
  ShoppingCart,
  GraduationCap,
} from "lucide-react";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";

interface OcorrenciaHome {
  id: string;
  titulo: string;
  data: string;
  prioridadeText: string;
  prioridadeStatus: LabelStatus;
  statusText: string;
  statusType: LabelStatus;
}

export default function Home() {
  // 1. Estatísticas Rápidas
  const stats: StatCardProps[] = [
    { label: "Máquinas Operacionais", value: "18/20", icon: CheckCircle2 },
    { label: "Em Manutenção", value: "2", icon: Wrench },
    { label: "Ocorrências Abertas", value: "5", icon: AlertTriangle },
    { label: "Turmas Ativas", value: "12", icon: Users },
  ];

  // 2. Action Cards (Acessos Rápidos da Lateral)
  const quickActions: ActionCardProps[] = [
    { label: "Máquinas", href: "/maquinas", icon: MonitorCog, desc: "Status e catálogo de equipamentos" },
    { label: "Ocorrências", href: "/ocorrencias", icon: MessageSquareWarning, desc: "Registrar e gerenciar chamados" },
    { label: "Compras", href: "/compras", icon: ShoppingCart, desc: "Solicitação de peças e insumos" },
    { label: "Alunos", href: "/alunos", icon: GraduationCap, desc: "Gestão e presença de alunos" },
    { label: "Turmas", href: "/turmas", icon: Users, desc: "Alocação dos laboratórios" },
  ];

  // 3. Ocorrências Recentes
  const recentOcorrencias: OcorrenciaHome[] = [
    {
      id: "OC-1024",
      titulo: "Vazamento de Óleo - Torno CNC 02",
      data: "Hoje, 08:30",
      prioridadeText: "Alta",
      prioridadeStatus: "negative",
      statusText: "Em Aberto",
      statusType: "warning",
    },
    {
      id: "OC-1023",
      titulo: "Barulho Anormal - Fresadora Universal",
      data: "Ontem, 16:45",
      prioridadeText: "Média",
      prioridadeStatus: "warning",
      statusText: "Em Atendimento",
      statusType: "default",
    },
    {
      id: "OC-1022",
      titulo: "Troca de Correia - Furadeira de Bancada",
      data: "28/07",
      prioridadeText: "Baixa",
      prioridadeStatus: "default",
      statusText: "Concluído",
      statusType: "positive",
    },
  ];

  // 4. Colunas da Tabela
  const columns: Column<OcorrenciaHome>[] = [
    {
      header: "Código",
      accessor: (item) => (
        <span className="font-semibold text-xs text-weg-blue">{item.id}</span>
      ),
    },
    {
      header: "Descrição",
      accessor: "titulo",
      className: "font-semibold text-gray-800 text-sm",
    },
    {
      header: "Data",
      accessor: "data",
      className: "text-xs text-gray-400",
    },
    {
      header: "Prioridade",
      accessor: (item) => (
        <LabelWithCircle
          text={item.prioridadeText}
          status={item.prioridadeStatus}
        />
      ),
    },
    {
      header: "Status",
      accessor: (item) => (
        <LabelWithCircle
          text={item.statusText}
          status={item.statusType}
        />
      ),
    },
  ];

  return (
    <LayoutDesktop>
  {/* Grid Principal dividindo a tela inteira em 2 colunas */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-6">
    
    {/* ================= COLUNA DA ESQUERDA (2/3 da tela) ================= */}
    <div className="lg:col-span-2 flex flex-col gap-6">
      
      {/* 1. Título e Subtítulo Principal */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800">
          Bem-vindo de volta, Alexander! 👋
        </h1>
        <p className="text-sm text-gray-500">
          Aqui está o resumo geral das operações e manutenções da oficina hoje.
        </p>
      </div>

      {/* 2. Bloco Superior: Cards de Indicadores (Grid 2x2) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      {/* 3. Bloco Inferior: Tabela de Ocorrências Recentes */}
      <section className="w-full bg-white rounded-lg border border-gray-100 shadow-md p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-weg-blue">
              Ocorrências Recentes
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Últimos apontamentos de manutenção no portal
            </p>
          </div>

          <Link
            href="/ocorrencias"
            className="p-1.5 text-weg-blue hover:bg-weg-blue/10 rounded-lg transition-colors"
            title="Ver todas as ocorrências"
          >
            <Link2 className="w-5 h-5" />
          </Link>
        </div>

        <Table columns={columns} data={recentOcorrencias} variant="plain" />
      </section>
    </div>

    {/* ================= COLUNA DA DIREITA (1/3 da tela) ================= */}
    <aside className="flex flex-col gap-6 ">
      
      {/* 1. Título "Links Rápidos" (Alinhado no topo com o H1 da esquerda) */}
      <div className="flex flex-col  justify-between  pb-[0.8rem]">
        <h2 className="text-xl font-bold text-gray-800">
          Links Rápidos
        </h2>
        <span className="text-xs text-gray-400">Atalhos</span>
      </div>

      {/* 2. Bloco Superior: Lista de Cards de Navegação */}
      <section className="flex flex-col gap-3">
        {quickActions.map((action, index) => (
          <ActionCard key={index} {...action} />
        ))}
      </section>

      {/* 3. Bloco Inferior: Card Informativo Extra */}
      <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-lg flex items-start gap-3">
        <Bell className="w-5 h-5 text-weg-blue shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-gray-800">Manutenção Preventiva</p>
          <p className="text-gray-500 mt-0.5">
            Agendada revisão nos tornos CNC para a próxima sexta-feira às 14:00.
          </p>
        </div>
      </div>

    </aside>

  </div>
</LayoutDesktop>
  );
}