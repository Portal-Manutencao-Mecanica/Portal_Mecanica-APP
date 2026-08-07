"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import { materialTypeLabels } from "@/components/molecules/MaterialCard";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type { HelperMaterial } from "@/lib/api/types";
import { canManageSupportMaterials } from "@/lib/permissions";
import { getServiceErrorMessage } from "@/services/httpService";
import { supportMaterialService } from "@/services/supportMaterialService";

export default function SupportMaterialDetails({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const canManage = canManageSupportMaterials(user?.role);
  const [material, setMaterial] = useState<HelperMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function removeMaterial() {
    if (!canManage || deleting) return;

    setDeleting(true);
    try {
      await supportMaterialService.remove(id);
      toast.success("Material de apoio excluído com sucesso.");
      router.push("/maquinas/material-complementar");
      router.refresh();
    } catch (deleteError) {
      toast.error(
        getServiceErrorMessage(deleteError, "Não foi possível excluir o material de apoio."),
      );
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  }

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
                <>
                  <Button href={material.url} icon={ExternalLink}>
                    Acessar material
                  </Button>
                  {canManage && (
                    <>
                      <Button
                        href={`/maquinas/material-complementar/${material.id}/editar`}
                        variant="secondary"
                        icon={Pencil}
                        iconOnly
                        aria-label={`Editar material ${material.title}`}
                        title="Editar material"
                      />
                      <Button
                        variant="danger"
                        icon={Trash2}
                        iconOnly
                        aria-label={`Excluir material ${material.title}`}
                        title="Excluir material"
                        onClick={() => setDeleteDialogOpen(true)}
                      />
                    </>
                  )}
                </>
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
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Excluir material de apoio"
        description={`Tem certeza que deseja excluir ${material?.title ?? "este material"}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir material"
        confirmVariant="danger"
        confirming={deleting}
        onCancel={() => !deleting && setDeleteDialogOpen(false)}
        onConfirm={removeMaterial}
      />
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
