"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import UploadedFile64 from "@/components/molecules/UploadedFile64";
import type { Place } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";
import { placeService } from "@/services/placeService";

const machineSchema = v.object({
  patrimony: v.pipe(v.string(), v.trim(), v.nonEmpty("Informe o número de patrimônio.")),
  name: v.pipe(v.string(), v.trim(), v.minLength(3, "O nome da máquina deve ter pelo menos 3 caracteres.")),
  placeId: v.pipe(v.string(), v.trim(), v.uuid("Selecione um local válido.")),
  condition: v.picklist(["CONFORME", "NAO_CONFORME"], "Selecione a condição."),
  tag: v.optional(v.string()),
});

type MachineFormData = v.InferInput<typeof machineSchema>;

export default function MachineForm() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [placesError, setPlacesError] = useState("");
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MachineFormData>({
    resolver: valibotResolver(machineSchema),
    defaultValues: { patrimony: "", name: "", placeId: "", condition: "CONFORME", tag: "" },
  });
  const placeId = useWatch({ control, name: "placeId" });
  const condition = useWatch({ control, name: "condition" });

  useEffect(() => {
    async function loadPlaces() {
      try {
        setPlaces(await placeService.list());
      } catch (error) {
        setPlacesError(getServiceErrorMessage(error, "Não foi possível carregar os locais."));
      } finally {
        setLoadingPlaces(false);
      }
    }

    void loadPlaces();
  }, []);

  async function onSubmit(data: MachineFormData) {
    try {
      const machine = await machineService.create({
        ...data,
        tag: data.tag?.trim() ?? "",
        image: images[0],
      });
      toast.success("Máquina cadastrada com sucesso.");
      router.push(`/maquinas/${machine.id}`);
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível cadastrar a máquina."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="border-b pb-2 text-lg font-semibold text-gray-800">Informações da máquina</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Número de patrimônio *" error={errors.patrimony?.message}>
          <Input placeholder="Ex.: 100004" {...register("patrimony")} />
        </Field>

        <Field label="Nome da máquina *" error={errors.name?.message}>
          <Input placeholder="Ex.: Torno mecânico" {...register("name")} />
        </Field>

        <DropDown
          label="Local *"
          defaultSelection={loadingPlaces ? "Carregando locais..." : "Selecione um local"}
          enumData={Object.fromEntries(places.map((place) => [place.id, place.name]))}
          value={placeId}
          onSelect={(value) => setValue("placeId", value, { shouldDirty: true, shouldValidate: true })}
          disabled={loadingPlaces || Boolean(placesError)}
          error={errors.placeId?.message || placesError}
        />

        <DropDown
          label="Condição *"
          defaultSelection="Selecione uma condição"
          enumData={{ CONFORME: "Conforme", NAO_CONFORME: "Não conforme" }}
          value={condition}
          onSelect={(value) => setValue("condition", value as MachineFormData["condition"], { shouldDirty: true, shouldValidate: true })}
          error={errors.condition?.message}
        />

        <Field label="Tag ou categoria" error={errors.tag?.message}>
          <Input placeholder="Ex.: CNC, 3D, FRESA" {...register("tag")} />
        </Field>
      </div>

      <section className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Imagem da máquina</h3>
          <p className="text-sm text-gray-500">
            Envie uma imagem PNG, JPG, WEBP ou SVG de até 5 MB.
          </p>
        </div>
        <UploadedFile64
          id="machine-image"
          value={images}
          onChange={setImages}
          maxFiles={1}
          maxFileSizeBytes={5 * 1024 * 1024}
          disabled={isSubmitting}
        />
      </section>

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
        <Button href="/maquinas" variant="secondary">Cancelar</Button>
        <Button type="submit" variant="primary" disabled={isSubmitting || loadingPlaces || Boolean(placesError)}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar máquina"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {children}
      {error && <span className="mt-1 block text-xs text-weg-negative">{error}</span>}
    </label>
  );
}
