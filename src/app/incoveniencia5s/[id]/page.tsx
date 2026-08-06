"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import SafeImage from "@/components/atoms/SafeImage";
import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type { Inconvenience5S, Inconvenience5SStatus } from "@/lib/api/types";
import { canChangeInconvenienceStatus } from "@/lib/permissions";
import { getStatusPresentation } from "@/lib/status";
import { inconvenienceService } from "@/services/inconvenienceService";
import { getServiceErrorMessage } from "@/services/httpService";

const editableStatuses = {
  EM_ANALISE: "Em análise",
  APROVADA: "Aprovada",
  REPROVADA: "Reprovada",
};

export default function InconvenienceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [item, setItem] = useState<Inconvenience5S | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Inconvenience5SStatus>("EM_ANALISE");
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState("");
  const canChangeStatus = canChangeInconvenienceStatus(user?.role);

  useEffect(() => {
    inconvenienceService
      .getById(id)
      .then((loaded) => {
        setItem(loaded);
        setSelectedStatus(loaded.status);
      })
      .catch((loadError) => {
        setError(
          getServiceErrorMessage(loadError, "Não foi possível carregar a ocorrência 5S."),
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function saveStatus() {
    if (!item) return;
    if (!(selectedStatus in editableStatuses)) {
      toast.error("Selecione uma situação válida.");
      return;
    }

    setSavingStatus(true);
    try {
      const updated = await inconvenienceService.updateStatus(id, selectedStatus);
      setItem(updated);
      setSelectedStatus(updated.status);
      toast.success("Situação atualizada com sucesso.");
    } catch (updateError) {
      toast.error(
        getServiceErrorMessage(updateError, "Não foi possível atualizar a situação."),
      );
    } finally {
      setSavingStatus(false);
    }
  }

  if (loading) {
    return <LayoutDesktop><PageFeedback message="Carregando ocorrência..." /></LayoutDesktop>;
  }

  if (!item) {
    return (
      <LayoutDesktop>
        <PageFeedback variant="error" message={error || "Ocorrência 5S não encontrada."} />
      </LayoutDesktop>
    );
  }

  const status = getStatusPresentation(item.status);

  return (
    <LayoutDesktop breadcrumbLabels={{ 1: item.placeName }}>
      <section className="space-y-6 pb-8">
        <PageHeader
          title="Ocorrência 5S"
          description={item.inconvenience}
          actions={<LabelWithCircle status={status.color} text={status.label} />}
        />

        <section className="grid gap-5 rounded-xl bg-weg-card-white p-6 shadow-sm md:grid-cols-2">
          <Detail label="Local" value={item.placeName} />
          <Detail label="Turma" value={item.classGroupAcronym} />
          <Detail label="Professor notificado" value={item.notifiedTeacherName} />
          <Detail label="Registrada por" value={item.createdByName} />
          <Detail label="Período" value={item.registrationPeriod} />
          <div className="md:col-span-2">
            <Detail label="Descrição" value={item.description} />
          </div>
        </section>

        {item.media.length > 0 && (
          <section className="rounded-xl bg-weg-card-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Fotos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {item.media.map((media, index) => (
                <SafeImage
                  key={media.id}
                  src={media.image}
                  alt={media.description || `Foto da ocorrência ${index + 1}`}
                  width={640}
                  height={420}
                  className="h-56 w-full rounded-xl object-cover"
                  unoptimized
                />
              ))}
            </div>
          </section>
        )}

        {canChangeStatus && (
          <section className="space-y-4 rounded-xl bg-weg-card-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Alterar situação</h2>
              <p className="text-sm text-gray-500">
                Registre se a inconveniência está em análise, aprovada ou reprovada.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full sm:max-w-sm">
                <DropDown
                  id="inconvenience-status"
                  label="Situação"
                  defaultSelection="Selecione a situação"
                  enumData={editableStatuses}
                  value={selectedStatus in editableStatuses ? selectedStatus : ""}
                  onSelect={(value) => setSelectedStatus(value as Inconvenience5SStatus)}
                />
              </div>
              <Button onClick={() => void saveStatus()} disabled={savingStatus}>
                {savingStatus ? "Salvando..." : "Salvar situação"}
              </Button>
            </div>
          </section>
        )}

        <Button href="/incoveniencia5s" variant="secondary">Voltar</Button>
      </section>
    </LayoutDesktop>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap font-medium text-gray-900">
        {value || "Não informado"}
      </p>
    </div>
  );
}
