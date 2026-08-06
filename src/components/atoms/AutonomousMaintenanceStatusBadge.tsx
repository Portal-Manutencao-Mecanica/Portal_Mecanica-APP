import type { AutonomousMaintenanceStatus } from "@/lib/api/types";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { getStatusPresentation } from "@/lib/status";

export function AutonomousMaintenanceStatusBadge({
  status,
}: {
  status: AutonomousMaintenanceStatus;
}) {
  const presentation = getStatusPresentation(status);
  return <LabelWithCircle status={presentation.color} text={presentation.label} />;
}
