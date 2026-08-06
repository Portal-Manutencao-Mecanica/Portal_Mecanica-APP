"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import { materialTypeLabels } from "@/components/molecules/MaterialCard";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { HelperMaterial } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { supportMaterialService } from "@/services/supportMaterialService";

export default function SupportMaterialDetails({ id }: { id: string }) {
  const [material, setMaterial] = useState<HelperMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    supportMaterialService.getById(id)
      .then((result) => {
        if (active) setMaterial(result);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          getServiceErrorMessage(loadError, "Não foi possível carregar o material de apoio."),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <LayoutDesktop breadcrumbLabels={material ? { 2: material.title } : undefined}>
      <section className="space-y-6">
        {loading ? (
          <PageFeedback message="Carregando material de apoio..." />
        ) : !material ? (
          <PageFeedback variant="error" message={error || "Material de apoio não encontrado."} />
        ) : (
          <>
            <PageHeader
              title={material.title}
              description="Detalhes do material de apoio."
              actions={(
                <Button href={material.url} icon={ExternalLink}>
                  Acessar material
                </Button>
              )}
            />

            <div className="rounded-xl border border-gray-200 bg-weg-card-white p-6 shadow-sm">
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Detail label="Tipo" value={materialTypeLabels[material.type]} />
                <Detail label="Endereço" value={material.url} breakWords />
                <div className="md:col-span-2">
                  <Detail
                    label="Descrição"
                    value={material.description || "Nenhuma descrição informada."}
                  />
                </div>
              </dl>
            </div>
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}

function Detail({
  label,
  value,
  breakWords = false,
}: {
  label: string;
  value: string;
  breakWords?: boolean;
}) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className={`mt-1 text-base text-gray-900 ${breakWords ? "break-all" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
