"use client";

import { useState } from "react";
import FaqItem, { FaqItemData } from "@/components/molecules/FaqItem";

const faqItems: FaqItemData[] = [
  {
    id: "registrar-ocorrencia",
    question: "Como registrar uma ocorrência?",
    answers: [{ text: "Para registrar uma ocorrência, acesse o menu Ocorrências, clique em Nova Ocorrência, selecione a máquina ou equipamento, descreva o problema, informe a criticidade e salve." }],
  },
  {
    id: "acompanhar-ocorrencia",
    question: "Como acompanhar uma ocorrência?",
    answers: [{ text: "Acesse o menu Ocorrências para visualizar todas as solicitações enviadas e seus respectivos status." }],
  },
  {
    id: "status",
    question: "O que significam os status?",
    answers: [{ items: ["Pendente: aguardando atendimento.", "Em andamento: manutenção em execução.", "Concluída: manutenção finalizada.", "Cancelada: ocorrência encerrada sem execução."] }],
  },
  {
    id: "criticidade",
    question: "O que significam os níveis de criticidade?",
    answers: [{ items: ["Baixa", "Média", "Alta", "Crítica"] }, { text: "Cada nível indica a prioridade da manutenção." }],
  },
  {
    id: "manutencoes-agendadas",
    question: "Como visualizar as manutenções agendadas?",
    answers: [{ text: "Acesse a página Calendário para visualizar todas as manutenções programadas." }],
  },
  {
    id: "localizar-maquina",
    question: "Como localizar uma máquina?",
    answers: [{ text: "Entre na página Máquinas e utilize os filtros ou a pesquisa para localizar o equipamento desejado." }],
  },
  {
    id: "solicitar-compra",
    question: "Como solicitar a compra de um equipamento?",
    answers: [{ text: "Acesse Compras, clique em Nova Solicitação, informe os dados necessários e envie para aprovação." }],
  },
  {
    id: "perfis",
    question: "Qual a diferença entre os perfis do sistema?",
    answers: [
      { text: "Aluno:", items: ["Registrar ocorrências.", "Acompanhar solicitações."] },
      { text: "Professor:", items: ["Gerenciar ocorrências.", "Acompanhar turmas.", "Visualizar máquinas."] },
      { text: "Coordenador:", items: ["Gerenciar usuários.", "Gerenciar máquinas.", "Gerenciar compras.", "Gerenciar turmas.", "Acesso completo ao sistema."] },
    ],
  },
  {
    id: "sem-acesso",
    question: "Não consigo acessar uma funcionalidade.",
    answers: [{ text: "Verifique se seu perfil possui permissão para acessar a funcionalidade desejada. Caso o problema persista, entre em contato com o coordenador." }],
  },
  {
    id: "senha",
    question: "Esqueci minha senha.",
    answers: [{ text: "Solicite a redefinição da senha ao coordenador responsável pelo sistema." }],
  },
];

export default function Faq() {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  function toggleItem(itemId: string) {
    setOpenItemId((currentItemId) => currentItemId === itemId ? null : itemId);
  }

  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-4xl">
      <div className="mb-6 rounded-xl border border-gray-200 border-t-8 border-t-weg-blue bg-white p-6 shadow-sm sm:p-8">
        <h1 id="faq-title" className="text-2xl font-bold text-gray-900 md:text-3xl">Perguntas frequentes</h1>
        <p className="mt-2 text-gray-500">Encontre respostas rápidas sobre o uso do Portal de Manutenção.</p>
      </div>

      <div className="space-y-3">
        {faqItems.map((item) => (
          <FaqItem
            key={item.id}
            item={item}
            isOpen={openItemId === item.id}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
