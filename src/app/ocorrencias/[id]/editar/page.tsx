"use client";

import { use, useState } from "react";

import MaintenceForm from "@/components/organisms/MaintenceForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default function EditOccurrencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [machineName, setMachineName] = useState("");

  return (
    <LayoutDesktop breadcrumbLabels={machineName ? { 1: machineName } : undefined}>
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Editar ocorrência</h1>
        <MaintenceForm occurrenceId={id} onOccurrenceLoaded={setMachineName} />
      </main>
    </LayoutDesktop>
  );
}
