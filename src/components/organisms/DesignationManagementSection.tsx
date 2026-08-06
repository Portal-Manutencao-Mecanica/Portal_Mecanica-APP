"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import PageFeedback from "@/components/molecules/PageFeedback";
import Pagination from "@/components/molecules/Pagination";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import DataTable from "@/components/organisms/DataTable";
import type { Designation, Page, Sector } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { designationService } from "@/services/designationService";
import { getServiceErrorMessage } from "@/services/httpService";

const PAGE_SIZE = 10;
const sectorLabels: Record<Sector, string> = {
  AREA_NAO_DESIGNADA: "Área não designada",
  CENTRO_WEG: "Centro WEG",
  WEG_MANUTENCAO: "WEG Manutenção",
};

export default function DesignationManagementSection() {
  const [designationPage, setDesignationPage] = useState<Page<Designation> | null>(null);
  const [page, setPage] = useState(0);
  const [editor, setEditor] = useState<Designation | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Designation | null>(null);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    designationService
      .list({ page, size: PAGE_SIZE, sort: "sector,asc" })
      .then((result) => {
        if (!active) return;
        setDesignationPage(result);
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          getServiceErrorMessage(
            loadError,
            "Não foi possível carregar as designações.",
          ),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, revision]);

  const columns = useMemo<ColumnProps<Designation>[]>(
    () => [
      {
        header: "Setor",
        render: (designation) => sectorLabels[designation.sector],
      },
      {
        header: "Ações",
        align: "right",
        render: (designation) => (
          <div className="flex justify-end gap-2">
            <Button
              icon={Pencil}
              iconOnly
              aria-label={`Editar designação ${sectorLabels[designation.sector]}`}
              title="Editar designação"
              onClick={() => setEditor(designation)}
            />
            <Button
              variant="danger"
              icon={Trash2}
              iconOnly
              aria-label={`Excluir designação ${sectorLabels[designation.sector]}`}
              title="Excluir designação"
              onClick={() => setDeleteTarget(designation)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  async function removeDesignation() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await designationService.remove(deleteTarget.id);
      toast.success("Designação excluída com sucesso.");
      setDeleteTarget(null);
      setLoading(true);
      setRevision((current) => current + 1);
    } catch (deleteError) {
      toast.error(
        getServiceErrorMessage(
          deleteError,
          "Não foi possível excluir a designação.",
        ),
      );
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Designações</h2>
          <p className="mt-1 text-sm text-gray-500">
            Mantenha as opções de setor usadas na classificação das atividades.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setEditor("new")}>
          Nova designação
        </Button>
      </div>

      {editor && (
        <DesignationForm
          designation={editor === "new" ? undefined : editor}
          onCancel={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setLoading(true);
            setRevision((current) => current + 1);
          }}
        />
      )}

      {loading ? (
        <PageFeedback message="Carregando designações..." />
      ) : error ? (
        <PageFeedback variant="error" message={error} />
      ) : (
        <>
          <DataTable
            data={designationPage?.content ?? []}
            columns={columns}
            searchKeys={["sector"]}
            searchPlaceholder="Pesquisar designação..."
            emptyMessage="Nenhuma designação cadastrada."
          />
          <Pagination
            page={designationPage?.number ?? page}
            totalPages={designationPage?.totalPages ?? 0}
            totalElements={designationPage?.totalElements ?? 0}
            onPageChange={(nextPage) => {
              setLoading(true);
              setPage(nextPage);
            }}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Excluir designação"
        description={`Tem certeza que deseja excluir ${deleteTarget ? sectorLabels[deleteTarget.sector] : "esta designação"}?`}
        confirmText="Excluir designação"
        confirmVariant="danger"
        confirming={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeDesignation}
      />
    </section>
  );
}

function DesignationForm({
  designation,
  onCancel,
  onSaved,
}: {
  designation?: Designation;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [sector, setSector] = useState<Sector | "">(designation?.sector ?? "");
  const [sectorError, setSectorError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (!sector) {
      setSectorError("Selecione um setor.");
      return;
    }

    setSaving(true);
    try {
      if (designation) {
        await designationService.update(designation.id, sector);
      } else {
        await designationService.create(sector);
      }
      toast.success(
        designation
          ? "Designação atualizada com sucesso."
          : "Designação criada com sucesso.",
      );
      onSaved();
    } catch (saveError) {
      toast.error(
        getServiceErrorMessage(
          saveError,
          designation
            ? "Não foi possível atualizar a designação."
            : "Não foi possível criar a designação.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-xl border border-gray-200 bg-weg-card-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {designation ? "Editar designação" : "Nova designação"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Selecione o setor que será disponibilizado no portal.
        </p>
      </div>
      <DropDown
        id="designation-sector"
        label="Setor *"
        defaultSelection="Selecione o setor"
        enumData={sectorLabels}
        value={sector}
        onSelect={(value) => {
          setSector(value as Sector | "");
          setSectorError("");
        }}
        error={sectorError}
      />
      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar designação"}
        </Button>
      </div>
    </form>
  );
}
