
"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import UploadedFile from "../molecules/UploadedFile64";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";

const IMAGE_BASE64_REGEX =
    /^data:image\/(png|jpg|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;

// Schema individual para cada item da compra (BuyItem)
const buyItemSchema = v.object({
    name: v.pipe(
        v.string("Informe o nome do item/material."),
        v.nonEmpty("Informe o nome do item/material.")
    ),
    quantity: v.pipe(
        v.number("A quantidade deve ser um número."),
        v.minValue(1, "A quantidade deve ser no mínimo 1.")
    ),
    specification: v.optional(v.string()),
});

// Schema principal da solicitação de compra (Buy)
const buySchema = v.object({
    classGroupId: v.pipe(
        v.string("Selecione a Turma."),
        v.nonEmpty("Selecione a Turma.")
    ),
    notifiedTeacherId: v.optional(v.string()),
    purchaseJustification: v.pipe(
        v.string("Descreva a justificativa da compra."),
        v.nonEmpty("A justificativa é obrigatória.")
    ),
    items: v.pipe(
        v.array(buyItemSchema, "Adicione pelo menos um item."),
        v.minLength(1, "Adicione pelo menos um item para solicitar a compra.")
    ),
    media: v.optional(
        v.array(
            v.pipe(
                v.string("A mídia precisa ser um texto em Base64."),
                v.regex(IMAGE_BASE64_REGEX, "Formato de imagem inválido.")
            )
        )
    ),
});

type BuyFormData = v.InferInput<typeof buySchema>;

// Mocks de dados enquanto não vêm via API
const MOCK_CLASS_GROUPS = [
    { id: "1", name: "MM 77 - Matutino" },
    { id: "2", name: "MM 78 - Matutino" },
    { id: "3", name: "MM 79 - Noturno" },
];

const MOCK_TEACHERS = [
    { id: "101", name: "Prof. Carlos Eduardo" },
    { id: "102", name: "Profª. Maria Fernandes" },
    { id: "103", name: "Prof. Roberto Silva" },
];

export default function BuyForm() {
    const { user } = useAuth();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<BuyFormData>({
        resolver: valibotResolver(buySchema),
        defaultValues: {
            classGroupId: "",
            notifiedTeacherId: "",
            purchaseJustification: "",
            items: [
                { name: "", quantity: 1, specification: "" }
            ],
            media: [],
        },
    });

    // Gerenciador do array dinâmico de itens
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const onSubmit = (formData: BuyFormData) => {
        // Payload formatado de acordo com as especificações do Spring Boot
        const payloadToApi = {
            createdByUserId: user?.id,
            classGroupId: Number(formData.classGroupId),
            notifiedTeacherId: formData.notifiedTeacherId
                ? Number(formData.notifiedTeacherId)
                : null,
            purchaseJustification: formData.purchaseJustification,
            items: formData.items,
            media: formData.media?.map((base64) => ({ urlOrBase64: base64 })) || [],
            // createdAt e status (NAO_VISUALIZADO) são preenchidos via @PrePersist no backend
        };

        console.log("Payload final para o Spring Boot:", payloadToApi);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6"
        >
            {/* Cabeçalho informativo */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-gray-500 block">Solicitante:</span>
                    <strong className="text-gray-800">
                        {user?.name || "Carregando..."}
                    </strong>
                </div>
                <div>
                    <span className="text-gray-500 block">Data da Solicitação:</span>
                    <strong className="text-gray-800">
                        {new Date().toLocaleString("pt-BR")}
                    </strong>
                </div>
            </div>

            {/* Seleção de Turma e Professor Notificado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Turma *
                    </label>
                    <select
                        {...register("classGroupId")}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Selecione a turma...</option>
                        {MOCK_CLASS_GROUPS.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                    {errors.classGroupId && (
                        <span className="text-xs text-red-500 mt-1 block">
                            {errors.classGroupId.message}
                        </span>
                    )}
                </div>


            </div>

            {/* Justificativa da Compra */}
            <TextArea
                label="Justificativa da Compra *"
                placeholder="Descreva o motivo da solicitação e onde os itens serão aplicados..."
                error={errors.purchaseJustification?.message}
                {...register("purchaseJustification")}
            />

            {/* Lista Dinâmica de Itens da Compra (List<BuyItem>) */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">

                        <h3 className="font-semibold text-gray-800">Itens da Compra *</h3>
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => append({ name: "", quantity: 1, specification: "" })}
                        className="text-xs flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Adicionar Item
                    </Button>
                </div>

                {errors.items?.message && (
                    <p className="text-xs text-red-500">{errors.items.message}</p>
                )}

                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="bg-white p-4 rounded-md border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-end shadow-sm"
                        >
                            <div className="md:col-span-5">
                                <Input
                                    label={`Item ${index + 1} *`}
                                    placeholder="Ex: Chave Allen 5mm"
                                    error={errors.items?.[index]?.name?.message}
                                    {...register(`items.${index}.name`)}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    type="number"
                                    label="Qtd *"
                                    placeholder="1"
                                    error={errors.items?.[index]?.quantity?.message}
                                    {...register(`items.${index}.quantity`, {
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>

                            <div className="md:col-span-4">
                                <Input
                                    label="Especificação / Obs"
                                    placeholder="Ex: Marca Gedore ou similar"
                                    {...register(`items.${index}.specification`)}
                                />
                            </div>

                            <div className="col-span-full md:col-span-1 flex justify-end md:justify-center pt-2 md:pt-0 pb-1">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-3 py-2 md:p-2 text-gray-600 md:text-gray-400 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 md:border-none"
                                    title="Remover Item"
                                >
                                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="md:hidden">Remover item</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mídias / Anexos Opcionais (List<Media>) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens de Referência (Opcional)
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

            {/* Botão de Envio */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    Enviar Solicitação de Compra
                </Button>
            </div>
        </form>
    );
}