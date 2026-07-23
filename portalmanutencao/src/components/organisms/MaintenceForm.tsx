"use client";

import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";

import UploadedFile from "../molecules/UploadedFile";
import { useAuth } from "@/hooks/useAuth"; // Importa o hook do local correto

const IMAGE_BASE64_REGEX = /^data:image\/(png|jpg|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;

const maintenanceSchema = v.object({
    patrimony: v.pipe(v.string(), v.nonEmpty("Informe o Patrimônio.")),
    tag: v.optional(v.string()),
    place: v.pipe(v.string(), v.nonEmpty("Selecione a Área/Laboratório.")),
    equipmentName: v.pipe(v.string(), v.nonEmpty("Informe o Nome do Equipamento.")),
    description: v.pipe(v.string(), v.nonEmpty("Descreva o problema.")),
    media: v.pipe(
        v.array(
            v.pipe(
                v.string("A mídia precisa ser um texto em Base64."),
                v.regex(IMAGE_BASE64_REGEX, "Formato de imagem inválido.")
            )
        ),
        v.minLength(1, "Anexe pelo menos uma imagem do ocorrido.")
    ),
});

type MaintenanceFormData = v.InferInput<typeof maintenanceSchema>;

export default function MaintenceForm() {
    const { user } = useAuth();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<MaintenanceFormData>({
        resolver: valibotResolver(maintenanceSchema),
        defaultValues: {
            patrimony: "",
            tag: "",
            place: "",
            equipmentName: "",
            description: "",
            media: []
        }
    });

    const onSubmit = (formData: MaintenanceFormData) => {
        const payloadToApi = {
            ...formData,
            createdAt: new Date().toISOString(),
            notifiedTeacherId: user?.id,
            studentIds: user?.role === "ALUNO" ? [user.id] : [],
        };

        console.log("Payload final para o Spring Boot:", payloadToApi);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-gray-500 block">Professor Notificado / Solicitante:</span>
                    <strong className="text-gray-800">{user?.name || "Carregando..."}</strong>
                </div>
                <div>
                    <span className="text-gray-500 block">Data / Hora do Registro:</span>
                    <strong className="text-gray-800">{new Date().toLocaleString("pt-BR")}</strong>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Patrimônio *"
                    placeholder="Ex: 100020"
                    error={errors.patrimony?.message}
                    {...register("patrimony")}
                />

                <Input
                    label="TAG"
                    placeholder="Ex: TORNO-01"
                    error={errors.tag?.message}
                    {...register("tag")}
                />

                <Input
                    label="Laboratório / Área CentroWEG *"
                    placeholder="Ex: Laboratório de Usinagem"
                    error={errors.place?.message}
                    {...register("place")}
                />

                <Input
                    label="Nome Equipamento / Identificação do Conjunto *"
                    placeholder="Ex: Torno CNC Romi"
                    error={errors.equipmentName?.message}
                    {...register("equipmentName")}
                />
            </div>

            <TextArea
                label="Descreva sobre o Problema *"
                placeholder="Identifique o que ocorreu no equipamento..."
                error={errors.description?.message}
                {...register("description")}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens da Anomalia (Anexe imagens pontuais) *
                </label>
                
                <Controller
                    name="media"
                    control={control}
                    render={({ field }) => (
                        <UploadedFile
                            onChange={(base64List) => field.onChange(base64List)}
                            error={errors.media?.message}
                        />
                    )}
                />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    Enviar Ocorrência
                </Button>
            </div>
        </form>
    );
}