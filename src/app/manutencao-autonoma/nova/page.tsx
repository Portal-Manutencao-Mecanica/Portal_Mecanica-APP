"use client";

import AutonomousMaintenanceForm from "@/components/organisms/AutonomousMaintenanceForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default function NewAutonomousMaintenancePage() {
  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-5xl pb-8">
        <AutonomousMaintenanceForm />
      </div>
    </LayoutDesktop>
  );
}
