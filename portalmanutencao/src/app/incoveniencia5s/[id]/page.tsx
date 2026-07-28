"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Inconvenience5S } from "@/lib/api/types";
import { inconvenienceService } from "@/services/inconvenienceService";
import type { LabelStatus } from "@/types/LabelStatus";

const statusStyle: Record<string, LabelStatus> = {
  NAO_VISUALIZADA: "warning",
  VISUALIZADA: "default",
  RESOLVIDA: "positive",
};

export default function InconvenienceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Inconvenience5S | null>(null);

  useEffect(() => {
    inconvenienceService.getById(id).then(setItem).catch(() => setItem(null));
  }, [id]);

  return (
    <LayoutDesktop>
      {!item ? <p className="ui-surface p-8 text-gray-500">Carregando ocorrência 5S...</p> : (
        <div className="ui-page">
          <div className="flex items-center justify-between">
            <div><h1 className="text-3xl font-bold">{item.inconvenience}</h1><p className="text-gray-500">Detalhes da ocorrência 5S.</p></div>
            <LabelWithCircle status={statusStyle[item.status] ?? "default"} text={item.status} />
          </div>
          <div className="ui-surface grid gap-6 p-8 md:grid-cols-2">
            <Detail label="Local" value={item.placeName} />
            <Detail label="Professor notificado" value={item.notifiedTeacherName} />
            <Detail label="Turma" value={item.classGroupAcronym} />
            <Detail label="Período" value={item.registrationPeriod} />
            <Detail label="Data" value={new Intl.DateTimeFormat("pt-BR").format(new Date(item.createdAt))} />
            <Detail label="Alunos envolvidos" value={item.involvedStudentIds.join(", ")} />
            <div className="md:col-span-2"><Detail label="Descrição" value={item.description} /></div>
          </div>
        </div>
      )}
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-semibold">{value || "-"}</p></div>;
}
