import { notFound } from "next/navigation";

import MaintenanceRequestWorkflow from "@/components/organisms/MaintenanceRequestWorkflow";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { maintenanceRequests } from "@/data/maintenanceRequests";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OccurrenceDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const request = maintenanceRequests.find((item) => item.id === id);

  if (!request) notFound();

  return (
    <LayoutDesktop>
      <MaintenanceRequestWorkflow request={request} />
    </LayoutDesktop>
  );
}
