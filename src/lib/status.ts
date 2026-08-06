import type { LabelStatus } from "@/types/LabelStatus";

const statusLabels: Record<string, string> = {
  NAO_VISUALIZADO: "Não visualizada",
  NAO_VISUALIZADA: "Não visualizada",
  EM_ANALISE: "Em análise",
  PEDIDO_EM_ANDAMENTO: "Pedido em andamento",
  EM_ANDAMENTO: "Em andamento",
  NOTIFICADO: "Notificado",
  PENDENTE: "Pendente",
  PENDENTE_APROVACAO_PROFESSOR: "Pendente de aprovação do professor",
  APROVADA_PELO_PROFESSOR: "Aprovada pelo professor",
  REPROVADA_PELO_PROFESSOR: "Reprovada pelo professor",
  PENDENTE_APROVACAO_COORDENADOR: "Pendente de aprovação do coordenador",
  AGUARDANDO_APROVACAO_COORDENADOR: "Aguardando aprovação do coordenador",
  APROVADA_PELO_COORDENADOR: "Aprovada pelo coordenador",
  REPROVADA_PELO_COORDENADOR: "Reprovada pelo coordenador",
  APROVADA: "Aprovada",
  REPROVADA: "Reprovada",
  FINALIZADA: "Finalizada",
  CONCLUIDA: "Concluída",
  ENTREGUE: "Entregue",
};

function fallbackLabel(status: string) {
  const normalized = status.replaceAll("_", " ").toLocaleLowerCase("pt-BR");
  return normalized.replace(/^./, (letter) => letter.toLocaleUpperCase("pt-BR"));
}

export function getStatusPresentation(status: string): {
  label: string;
  color: LabelStatus;
} {
  const normalizedStatus = status.trim().toLocaleUpperCase("pt-BR");
  let color: LabelStatus = "default";

  if (
    normalizedStatus === "FINALIZADA"
    || normalizedStatus === "FINALIZADO"
    || normalizedStatus === "CONCLUIDA"
    || normalizedStatus === "CONCLUIDO"
    || normalizedStatus === "ENTREGUE"
  ) {
    color = "positive";
  } else if (normalizedStatus.includes("REPROVAD")) {
    color = "negative";
  } else if (normalizedStatus.includes("APROVAD") || normalizedStatus === "NOTIFICADO") {
    color = "info";
  } else if (
    normalizedStatus.includes("ANALISE")
    || normalizedStatus.includes("PENDENTE")
    || normalizedStatus.includes("AGUARDANDO")
    || normalizedStatus.includes("NAO_VISUALIZAD")
    || normalizedStatus.includes("EM_ANDAMENTO")
  ) {
    color = "warning";
  }

  return {
    label: statusLabels[normalizedStatus] ?? fallbackLabel(normalizedStatus),
    color,
  };
}
