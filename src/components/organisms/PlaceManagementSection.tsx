"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageFeedback from "@/components/molecules/PageFeedback";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import DataTable from "@/components/organisms/DataTable";
import type { Place } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { placeService } from "@/services/placeService";

const placeSchema = v.pipe(
  v.string(),
  v.trim(),
  v.minLength(2, "Informe um nome com pelo menos 2 caracteres."),
  v.maxLength(120, "O nome deve possuir no máximo 120 caracteres."),
);

export default function PlaceManagementSection() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [editor, setEditor] = useState<Place | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Place | null>(null);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    placeService
      .list()
      .then((result) => {
        if (!active) return;
        setPlaces(result);
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          getServiceErrorMessage(loadError, "Não foi possível carregar os locais."),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [revision]);

  const columns = useMemo<ColumnProps<Place>[]>(
    () => [
      { header: "Nome", accessorKey: "name" },
      {
        header: "Ações",
        align: "right",
        render: (place) => (
          <div className="flex justify-end gap-2">
            <Button
              icon={Pencil}
              iconOnly
              aria-label={`Editar local ${place.name}`}
              title="Editar local"
              onClick={() => setEditor(place)}
            />
            <Button
              variant="danger"
              icon={Trash2}
              iconOnly
              aria-label={`Excluir local ${place.name}`}
              title="Excluir local"
              onClick={() => setDeleteTarget(place)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  async function removePlace() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await placeService.remove(deleteTarget.id);
      toast.success("Local excluído com sucesso.");
      setDeleteTarget(null);
      setLoading(true);
      setRevision((current) => current + 1);
    } catch (deleteError) {
      toast.error(
        getServiceErrorMessage(
          deleteError,
          "Não foi possível excluir o local. Verifique se ele está em uso.",
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
          <h2 className="text-lg font-semibold text-gray-800">Locais</h2>
          <p className="mt-1 text-sm text-gray-500">
            Cadastre os espaços usados por máquinas, eventos e ocorrências.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setEditor("new")}>
          Novo local
        </Button>
      </div>

      {editor && (
        <PlaceForm
          place={editor === "new" ? undefined : editor}
          onCancel={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            setLoading(true);
            setRevision((current) => current + 1);
          }}
        />
      )}

      {loading ? (
        <PageFeedback message="Carregando locais..." />
      ) : error ? (
        <PageFeedback variant="error" message={error} />
      ) : (
        <DataTable
          data={places}
          columns={columns}
          searchKeys={["name"]}
          searchPlaceholder="Pesquisar local..."
          emptyMessage="Nenhum local cadastrado."
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Excluir local"
        description={`Tem certeza que deseja excluir ${deleteTarget?.name ?? "este local"}?`}
        confirmText="Excluir local"
        confirmVariant="danger"
        confirming={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removePlace}
      />
    </section>
  );
}

function PlaceForm({
  place,
  onCancel,
  onSaved,
}: {
  place?: Place;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(place?.name ?? "");
  const [nameError, setNameError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const result = v.safeParse(placeSchema, name);
    if (!result.success) {
      setNameError(result.issues[0]?.message ?? "Revise o nome do local.");
      return;
    }

    setSaving(true);
    try {
      if (place) {
        await placeService.update(place.id, result.output);
      } else {
        await placeService.create(result.output);
      }
      toast.success(place ? "Local atualizado com sucesso." : "Local criado com sucesso.");
      onSaved();
    } catch (saveError) {
      toast.error(
        getServiceErrorMessage(
          saveError,
          place ? "Não foi possível atualizar o local." : "Não foi possível criar o local.",
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
          {place ? "Editar local" : "Novo local"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Use um nome claro e reconhecível para todos os usuários.
        </p>
      </div>
      <Input
        id="place-name"
        label="Nome *"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setNameError("");
        }}
        error={nameError}
        maxLength={120}
        required
      />
      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar local"}
        </Button>
      </div>
    </form>
  );
}
