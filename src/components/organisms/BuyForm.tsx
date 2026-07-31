"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import UploadedFile from "../molecules/UploadedFile64";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, ShoppingBag, Wrench } from "lucide-react";
import { EquipmentProps } from "@/props/EquipmentProps";
import EquipamentCombobox from "../atoms/EquipmentCombobox";

const IMAGE_BASE64_REGEX =
    /^data:image\/(png|jpg|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;

// Schema para cada item da compra (BuyItem)
const buyItemSchema = v.object({
    equipmentId: v.optional(v.string()),
    isNewEquipment: v.boolean(),
    equipmentName: v.pipe(
        v.string("Informe o equipamento."),
        v.nonEmpty("Selecione ou digite um equipamento.")
    ),
    quantity: v.pipe(
        v.unknown(),
        v.transform((val) => (val === "" || val === null || isNaN(Number(val)) ? 0 : Number(val))),
        v.number("A quantidade deve ser um número."),
        v.minValue(1, "A quantidade mínima é 1.")
    ),
    technicalSpecification: v.optional(v.string()),
    sap: v.optional(v.string()),
    patrimony: v.optional(v.string()),
    tag: v.optional(v.string()),
    mechanicalSet: v.optional(v.string()),
});

const buySchema = v.object({
    classGroupId: v.pipe(
        v.string("Selecione a Turma."),
        v.nonEmpty("Selecione a Turma.")
    ),
    notifiedTeacherId: v.optional(v.string()),
    purchaseJustification: v.pipe(
        v.string("Descreva a justificativa."),
        v.nonEmpty("A justificativa é obrigatória.")
    ),
    items: v.pipe(
        v.array(buyItemSchema, "Adicione pelo menos um item."),
        v.minLength(1, "Adicione pelo menos um item para solicitar a compra.")
    ),
    media: v.optional(
        v.array(
            v.pipe(
                v.string("A mídia precisa ser Base64."),
                v.regex(IMAGE_BASE64_REGEX, "Formato de imagem inválido.")
            )
        )
    ),
});

type BuyFormData = v.InferInput<typeof buySchema>;

const MOCK_EQUIPMENTS: EquipmentProps[] = [
    {
        id: "e1a2b3c4-1111-2222-3333-444455556666",
        name: "Torno CNC Romi Centur 30D",
        patrimony: "100204",
        tag: "TORNO-01",
        sap: "SAP-998877",
        unitPrice: 0
    },
    {
        id: "f9e8d7c6-2222-3333-4444-555566667777",
        name: "Fresadora Ferramenteira ISO 40",
        patrimony: "100205",
        tag: "FRES-02",
        sap: "SAP-112233",
        unitPrice: 0
    },
];

export default function BuyForm() {
    const { user } = useAuth();

    const {
        register,
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<BuyFormData>({
        resolver: valibotResolver(buySchema),
        defaultValues: {
            classGroupId: "",
            notifiedTeacherId: "",
            purchaseJustification: "",
            items: [
                {
                    equipmentId: "",
                    isNewEquipment: false,
                    equipmentName: "",
                    quantity: 1,
                    technicalSpecification: "",
                    sap: "",
                    patrimony: "",
                    tag: "",
                    mechanicalSet: "",
                },
            ],
            media: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const onSubmit = (formData: BuyFormData) => {
        const payloadToApi = {
            createdByUserId: user?.id,
            classGroupId: formData.classGroupId,
            notifiedTeacherId: formData.notifiedTeacherId || null,
            purchaseJustification: formData.purchaseJustification,
            items: formData.items.map((item) => ({
                equipmentId: item.isNewEquipment ? null : item.equipmentId,
                newEquipmentData: item.isNewEquipment
                    ? {
                        name: item.equipmentName,
                        patrimony: item.patrimony,
                        tag: item.tag,
                        sap: item.sap,
                    }
                    : null,
                quantity: item.quantity,
                technicalSpecification: item.technicalSpecification,
                sap: item.sap,
                patrimony: item.patrimony,
                tag: item.tag,
                mechanicalSet: item.mechanicalSet,
            })),
            media: formData.media?.map((base64) => ({ urlOrBase64: base64 })) || [],
        };

        console.log("Payload pronto para o Spring Boot:", payloadToApi);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6"
        >
            {/* Lista Dinâmica de BuyItems */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        
                        <h3 className="font-semibold text-gray-800">Itens da Compra *</h3>
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            append({
                                equipmentId: "",
                                isNewEquipment: false,
                                equipmentName: "",
                                quantity: 1,
                                technicalSpecification: "",
                                sap: "",
                                patrimony: "",
                                tag: "",
                                mechanicalSet: "",
                            })
                        }
                        className="text-xs flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Adicionar Item
                    </Button>
                </div>

                {errors.items?.message && (
                    <p className="text-xs text-red-500">{errors.items.message}</p>
                )}

                <div className="space-y-4">
                    {fields.map((field, index) => {
                        const equipmentId = watch(`items.${index}.equipmentId`);
                        const equipmentName = watch(`items.${index}.equipmentName`);

                        return (
                            <div
                                key={field.id}
                                className="bg-white p-4 rounded-lg border border-gray-200 space-y-3 shadow-sm"
                            >
                                {/* Linha 1: Combobox do Equipamento + Quantidade */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                    <div className="md:col-span-9">
                                        <EquipamentCombobox
                                            options={MOCK_EQUIPMENTS}
                                            value={equipmentId}
                                            selectedName={equipmentName}
                                            error={errors.items?.[index]?.equipmentName?.message}
                                            onChange={(selected) => {
                                                if ("isNew" in selected) {
                                                    setValue(`items.${index}.equipmentId`, "", { shouldValidate: true });
                                                    setValue(`items.${index}.isNewEquipment`, true, { shouldValidate: true });
                                                    setValue(`items.${index}.equipmentName`, selected.name, { shouldValidate: true });
                                                    setValue(`items.${index}.patrimony`, "", { shouldValidate: true });
                                                    setValue(`items.${index}.tag`, "", { shouldValidate: true });
                                                    setValue(`items.${index}.sap`, "", { shouldValidate: true });
                                                } else {
                                                    setValue(`items.${index}.equipmentId`, selected.id, { shouldValidate: true });
                                                    setValue(`items.${index}.isNewEquipment`, false, { shouldValidate: true });
                                                    setValue(`items.${index}.equipmentName`, selected.name, { shouldValidate: true });
                                                    setValue(`items.${index}.patrimony`, selected.patrimony || "", { shouldValidate: true });
                                                    setValue(`items.${index}.tag`, selected.tag || "", { shouldValidate: true });
                                                    setValue(`items.${index}.sap`, selected.sap || "", { shouldValidate: true });
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="md:col-span-3">
                                        <Input
                                            type="number"
                                            label="Quantidade *"
                                            placeholder="1"
                                            error={errors.items?.[index]?.quantity?.message}
                                            {...register(`items.${index}.quantity`, {
                                                valueAsNumber: true,
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Indicador de Status */}
                                <div className="flex items-center gap-2 text-xs">
                                    
                                    <span className="text-gray-500">
                                        Status:{" "}
                                        <strong
                                            className={
                                                watch(`items.${index}.isNewEquipment`)
                                                    ? "text-weg-negative"
                                                    : "text-weg-positive"
                                            }
                                        >
                                            {watch(`items.${index}.isNewEquipment`)
                                                ? "Novo Equipamento (Será cadastrado)"
                                                : "Equipamento Existente Selecionado"}
                                        </strong>
                                    </span>
                                </div>

                                {/* Linha 2: Atributos preenchidos AUTOMATICAMENTE */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
                                    <Input
                                        label="Patrimônio"
                                        placeholder="Ex: 100204"
                                        {...register(`items.${index}.patrimony`)}
                                    />
                                    <Input
                                        label="TAG"
                                        placeholder="Ex: TORNO-01"
                                        {...register(`items.${index}.tag`)}
                                    />
                                    <Input
                                        label="Código SAP"
                                        placeholder="Ex: SAP-123"
                                        {...register(`items.${index}.sap`)}
                                    />
                                    <Input
                                        label="Conjunto Mecânico"
                                        placeholder="Ex: Eixo Árvore"
                                        {...register(`items.${index}.mechanicalSet`)}
                                    />
                                </div>

                                {/* Linha 3: Especificação Técnica */}
                                <TextArea
                                    label="Especificação Técnica do Item"
                                    placeholder="Detalhes técnicos sobre o item ou peça de reposição necessária..."
                                    {...register(`items.${index}.technicalSpecification`)}
                                />

                                {/* Linha 4: Botão de remoção */}
                                <div className="col-span-full flex justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 px-3 py-2 md:p-2 text-gray-600 md:text-gray-400 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 md:border-none"
                                        title="Remover Item"
                                    >
                                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="md:hidden">Remover item</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    Enviar Solicitação de Compra
                </Button>
            </div>
        </form>
    );
}