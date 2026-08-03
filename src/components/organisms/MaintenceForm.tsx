"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import TextArea from "@/components/atoms/TextArea";
import UploadedFile64 from "@/components/molecules/UploadedFile64";
import { useAuth } from "@/hooks/useAuth";
import type {
  Machine,
  MaintenanceRequestPriority,
  MaintenanceRequestSector,
  Place,
  Teacher,
} from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";
import { placeService } from "@/services/placeService";
import { teacherService } from "@/services/teacherService";

const IMAGE_BASE64_REGEX = /^data:image\/(png|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;

const maintenanceSchema = v.object({
  sector: v.picklist(
    ["AREA_NAO_DESIGNADA", "CENTRO_WEG", "WEG_MANUTENCAO"],
    "Selecione o setor.",
  ),
  priority: v.picklist(["BAIXA", "MEDIA", "ALTA"], "Selecione a prioridade."),
  placeId: v.pipe(v.string(), v.trim(), v.uuid("Selecione um local válido.")),
  machineId: v.pipe(v.string(), v.trim(), v.uuid("Selecione uma máquina válida.")),
  notifiedTeacherId: v.pipe(v.string(), v.trim(), v.uuid("Selecione um professor válido.")),
  description: v.pipe(
    v.string("Descreva o problema."),
    v.trim(),
    v.nonEmpty("Descreva o problema."),
  ),
  images: v.array(v.pipe(v.string(), v.regex(IMAGE_BASE64_REGEX, "Formato de imagem inválido."))),
});

type MaintenanceFormData = v.InferInput<typeof maintenanceSchema>;

export default function MaintenceForm({ occurrenceId }: { occurrenceId?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const canSubmit = !occurrenceId || user?.role === "ADMIN";
  const [places, setPlaces] = useState<Place[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceFormData>({
    resolver: valibotResolver(maintenanceSchema),
    defaultValues: {
      sector: "AREA_NAO_DESIGNADA",
      priority: "MEDIA",
      placeId: "",
      machineId: "",
      notifiedTeacherId: "",
      description: "",
      images: [],
    },
  });
  const sector = useWatch({ control, name: "sector" });
  const priority = useWatch({ control, name: "priority" });
  const placeId = useWatch({ control, name: "placeId" });
  const machineId = useWatch({ control, name: "machineId" });
  const notifiedTeacherId = useWatch({ control, name: "notifiedTeacherId" });

  useEffect(() => {
    async function loadOptions() {
      try {
        const [loadedPlaces, machinePage, loadedTeachers, occurrence] = await Promise.all([
          placeService.list(),
          machineService.list(),
          teacherService.list(),
          occurrenceId ? maintenanceRequestService.getById(occurrenceId) : Promise.resolve(null),
        ]);
        setPlaces(loadedPlaces);
        setMachines(machinePage.content);
        setTeachers(loadedTeachers);
        if (occurrence) {
          reset({
            sector: occurrence.sector,
            priority: occurrence.priority,
            placeId: occurrence.placeId,
            machineId: occurrence.machineId,
            notifiedTeacherId: occurrence.notifiedTeacherId,
            description: occurrence.description,
            images: occurrence.media.map((media) => media.image),
          });
        }
      } catch (error) {
        setLoadError(
          getServiceErrorMessage(error, "Não foi possível carregar os dados do cadastro."),
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    void loadOptions();
  }, [occurrenceId, reset]);

  async function onSubmit(formData: MaintenanceFormData) {
    if (formData.images.length === 0) {
      toast.error("Anexe pelo menos uma imagem da ocorrência.");
      return;
    }
    if (formData.images.length > 5) {
      toast.error("Envie no máximo 5 imagens por ocorrência.");
      return;
    }
    try {
      const payload = {
        sector: formData.sector as MaintenanceRequestSector,
        priority: formData.priority as MaintenanceRequestPriority,
        placeId: formData.placeId,
        machineId: formData.machineId,
        notifiedTeacherId: formData.notifiedTeacherId,
        description: formData.description,
        images: formData.images,
      };
      const occurrence = occurrenceId
        ? await maintenanceRequestService.update(occurrenceId, payload)
        : await maintenanceRequestService.create(payload);
      toast.success(occurrenceId ? "Ocorrência atualizada com sucesso." : "Ocorrência enviada para aprovação do professor.");
      router.push(`/ocorrencias/${occurrence.id}`);
      router.refresh();
    } catch (error) {
      toast.error(getServiceErrorMessage(error, occurrenceId ? "Não foi possível atualizar a ocorrência." : "Não foi possível cadastrar a ocorrência."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm md:grid-cols-2">
        <div>
          <span className="block text-gray-500">Solicitante:</span>
          <strong className="text-gray-800">{user?.name || "Carregando..."}</strong>
        </div>
        <div>
          <span className="block text-gray-500">Data / hora do registro:</span>
          <strong className="text-gray-800">{new Date().toLocaleString("pt-BR")}</strong>
        </div>
      </div>

      {occurrenceId && !canSubmit && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Apenas administradores podem alterar ocorrências.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DropDown label="Setor *" defaultSelection="Selecione o setor" enumData={{ AREA_NAO_DESIGNADA: "Área não designada", CENTRO_WEG: "Centro WEG", WEG_MANUTENCAO: "WEG Manutenção" }} value={sector} onSelect={(value) => setValue("sector", value as MaintenanceFormData["sector"], { shouldDirty: true, shouldValidate: true })} error={errors.sector?.message} />

        <DropDown label="Prioridade *" defaultSelection="Selecione a prioridade" enumData={{ BAIXA: "Baixa", MEDIA: "Média", ALTA: "Alta" }} value={priority} onSelect={(value) => setValue("priority", value as MaintenanceFormData["priority"], { shouldDirty: true, shouldValidate: true })} error={errors.priority?.message} />

        <DropDown label="Local *" defaultSelection={loadingOptions ? "Carregando locais..." : "Selecione o local"} enumData={Object.fromEntries(places.map((place) => [place.id, place.name]))} value={placeId} onSelect={(value) => setValue("placeId", value, { shouldDirty: true, shouldValidate: true })} disabled={loadingOptions || Boolean(loadError)} error={errors.placeId?.message} />

        <DropDown label="Máquina *" defaultSelection={loadingOptions ? "Carregando máquinas..." : "Selecione a máquina"} enumData={Object.fromEntries(machines.map((machine) => [machine.id, `${machine.name} (${machine.patrimony})`]))} value={machineId} onSelect={(value) => setValue("machineId", value, { shouldDirty: true, shouldValidate: true })} disabled={loadingOptions || Boolean(loadError)} error={errors.machineId?.message} />

        <DropDown label="Professor notificado *" defaultSelection={loadingOptions ? "Carregando professores..." : "Selecione o professor"} enumData={Object.fromEntries(teachers.map((teacher) => [teacher.id, teacher.name]))} value={notifiedTeacherId} onSelect={(value) => setValue("notifiedTeacherId", value, { shouldDirty: true, shouldValidate: true })} disabled={loadingOptions || Boolean(loadError)} error={errors.notifiedTeacherId?.message} />
      </div>

      <TextArea
        label="Descreva o problema *"
        placeholder="Identifique o que ocorreu no equipamento..."
        error={errors.description?.message}
        {...register("description")}
      />

      <Controller
        name="images"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <label htmlFor="occurrence-images" className="mb-2 block text-sm font-medium text-gray-700">Imagens da ocorrência *</label>
            <UploadedFile64
              id="occurrence-images"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              maxFiles={5}
              maxFileSizeBytes={5 * 1024 * 1024}
              disabled={!canSubmit}
            />
            <p id="occurrence-images-help" className="mt-2 text-xs text-gray-500">Envie até 5 imagens em PNG, JPG, WEBP ou SVG, com no máximo 5 MB cada.</p>
          </div>
        )}
      />

      {loadError && <p className="text-sm text-weg-negative">{loadError}</p>}

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <Link href="/ocorrencias"><Button type="button" variant="secondary">Cancelar</Button></Link>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || loadingOptions || Boolean(loadError) || !canSubmit}
        >
          {isSubmitting ? "Salvando..." : occurrenceId ? "Salvar alterações" : "Enviar ocorrência"}
        </Button>
      </div>
    </form>
  );
}
