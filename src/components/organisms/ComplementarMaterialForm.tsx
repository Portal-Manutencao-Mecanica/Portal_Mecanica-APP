"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import { useAuth } from "@/hooks/useAuth";
import type { HelperMaterial, Page } from "@/lib/api/types";
import { canManageSupportMaterials } from "@/lib/permissions";
import { getServiceErrorMessage } from "@/services/httpService";
import { supportMaterialService } from "@/services/supportMaterialService";
import MaterialCard from "../molecules/MaterialCard";

const PAGE_SIZE = 9;

export default function ComplementarMaterialForm() {
  const { user } = useAuth();
  const canManage = canManageSupportMaterials(user?.role);
  const [materialPage, setMaterialPage] = useState<Page<HelperMaterial> | null>(null);
  const [page, setPage] = useState(0);
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const [error, setError] = useState("");
  const loading = loadedPage !== page;

  useEffect(() => {
    let active = true;

    supportMaterialService.list({ page, size: PAGE_SIZE, sort: "title,asc" })
      .then((result) => {
        if (!active) return;
        setMaterialPage(result);
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          getServiceErrorMessage(
            loadError,
            "Não foi possível carregar os materiais de apoio.",
          ),
        );
      })
      .finally(() => {
        if (active) setLoadedPage(page);
      });

    return () => {
      active = false;
    };
  }, [page]);

  const materials = materialPage?.content ?? [];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Material de apoio"
        description="Consulte os materiais disponíveis para estudo e manutenção dos equipamentos."
        actions={canManage ? (
          <Button href="/maquinas/material-complementar/novo" icon={Plus}>
            Novo material
          </Button>
        ) : undefined}
      />

      {loading ? (
        <PageFeedback message="Carregando materiais de apoio..." />
      ) : error ? (
        <PageFeedback variant="error" message={error} />
      ) : materials.length === 0 ? (
        <PageFeedback variant="empty" message="Nenhum material de apoio cadastrado." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
          <Pagination
            page={materialPage?.number ?? page}
            totalPages={materialPage?.totalPages ?? 0}
            totalElements={materialPage?.totalElements ?? 0}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
