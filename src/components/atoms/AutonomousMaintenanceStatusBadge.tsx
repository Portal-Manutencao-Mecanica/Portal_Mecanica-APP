import type { AutonomousMaintenanceStatus } from "@/lib/api/types";

const statusConfig: Record<
  AutonomousMaintenanceStatus,
  { label: string; className: string }
> = {
  PENDENTE_APROVACAO_COORDENADOR: {
    label: "Aguardando aprovação",
    className: "bg-amber-100 text-amber-800 ring-amber-600/20",
  },
  APROVADA_PELO_COORDENADOR: {
    label: "Aprovada",
    className: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  },
  REPROVADA_PELO_COORDENADOR: {
    label: "Reprovada",
    className: "bg-red-100 text-red-800 ring-red-600/20",
  },
};

export function AutonomousMaintenanceStatusBadge({
  status,
}: {
  status: AutonomousMaintenanceStatus;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}
