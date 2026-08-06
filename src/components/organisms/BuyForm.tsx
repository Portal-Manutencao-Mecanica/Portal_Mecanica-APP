"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import EquipamentCombobox from "@/components/atoms/EquipmentCombobox";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import { useAuth } from "@/hooks/useAuth";
import type { Buy, ClassGroup, CreateBuyItem, Teacher } from "@/lib/api/types";
import type { EquipmentProps } from "@/props/EquipmentProps";
import { buyService } from "@/services/buyService";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { equipmentService } from "@/services/equipmentService";
import { applyApiFieldErrors, getServiceErrorMessage } from "@/services/httpService";
import { teacherService } from "@/services/teacherService";
import { canEditPurchase, canManageEquipment } from "@/lib/permissions";

const buyItemSchema = v.object({
  equipmentId: v.optional(v.string()),
  isNewEquipment: v.boolean(),
  equipmentName: v.pipe(
    v.string("Informe o equipamento."),
    v.trim(),
    v.nonEmpty("Selecione ou digite um equipamento."),
  ),
  quantity: v.pipe(
    v.unknown(),
    v.transform((value) =>
      value === "" || value === null || Number.isNaN(Number(value)) ? 0 : Number(value),
    ),
    v.number("A quantidade deve ser um número."),
    v.minValue(1, "A quantidade mínima é 1."),
  ),
  technicalSpecification: v.optional(v.string()),
  sap: v.optional(v.string()),
  patrimony: v.optional(v.string()),
  tag: v.optional(v.string()),
  mechanicalSet: v.optional(v.string()),
});

const buySchema = v.object({
  classGroupId: v.pipe(
    v.string("Selecione a turma."),
    v.trim(),
    v.uuid("Selecione uma turma válida."),
  ),
  notifiedTeacherId: v.optional(
    v.union([
      v.literal(""),
      v.pipe(v.string(), v.trim(), v.uuid("Selecione um professor válido.")),
    ]),
  ),
  purchaseJustification: v.pipe(
    v.string("Descreva a justificativa."),
    v.trim(),
    v.nonEmpty("A justificativa é obrigatória."),
  ),
  items: v.pipe(
    v.array(buyItemSchema, "Adicione pelo menos um item."),
    v.minLength(1, "Adicione pelo menos um item para solicitar a compra."),
  ),
});

type BuyFormData = v.InferInput<typeof buySchema>;

const emptyItem: BuyFormData["items"][number] = {
  equipmentId: "",
  isNewEquipment: false,
  equipmentName: "",
  quantity: 1,
  technicalSpecification: "",
  sap: "",
  patrimony: "",
  tag: "",
  mechanicalSet: "",
};

function emptyToUndefined(value?: string) {
  const normalized = value?.trim();
  return normalized || undefined;
}

function defaultValues(buy?: Buy): BuyFormData {
  if (!buy) {
    return {
      classGroupId: "",
      notifiedTeacherId: "",
      purchaseJustification: "",
      items: [{ ...emptyItem }],
    };
  }

  return {
    classGroupId: buy.classGroupId,
    notifiedTeacherId: buy.notifiedTeacherId ?? "",
    purchaseJustification: buy.purchaseJustification,
    items: buy.items.map((item) => ({
      equipmentId: item.equipmentId,
      isNewEquipment: false,
      equipmentName: item.equipmentName,
      quantity: item.quantity,
      technicalSpecification: item.technicalSpecification ?? "",
      sap: item.sap ?? "",
      patrimony: item.patrimony ?? "",
      tag: item.tag ?? "",
      mechanicalSet: item.mechanicalSet ?? "",
    })),
  };
}

export default function BuyForm({ buy }: { buy?: Buy }) {
  const router = useRouter();
  const { user } = useAuth();
  const canEdit = !buy || canEditPurchase(user?.role, user?.id, buy);
  const canCreateEquipment = canManageEquipment(user?.role);
  const [equipments, setEquipments] = useState<EquipmentProps[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [registeredAt] = useState(() => buy?.createdAt ?? new Date().toISOString());
  const {
    register,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BuyFormData>({
    resolver: valibotResolver(buySchema),
    defaultValues: defaultValues(buy),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const classGroupId = useWatch({ control, name: "classGroupId" });
  const notifiedTeacherId = useWatch({ control, name: "notifiedTeacherId" });
  const watchedItems = useWatch({ control, name: "items" });

  useEffect(() => {
    async function loadOptions() {
      try {
        const [equipmentPage, classGroupPage, loadedTeachers] = await Promise.all([
          equipmentService.list(100),
          classGroupBrowserService.list(100),
          teacherService.list(),
        ]);
        setEquipments(
          equipmentPage.content.map((equipment) => ({
            id: equipment.id,
            name: equipment.name,
            sap: equipment.sap ?? undefined,
            patrimony: equipment.patrimony ?? undefined,
            tag: equipment.tag ?? undefined,
            unitPrice: equipment.unitPrice,
            availableQuantity: equipment.availableQuantity,
          })),
        );
        setClassGroups(classGroupPage.content.filter((classGroup) => classGroup.enabled));
        setTeachers(
          loadedTeachers.filter((teacher) => teacher.enabled && teacher.accountNonLocked),
        );
      } catch (error) {
        setLoadError(
          getServiceErrorMessage(
            error,
            "Não foi possível carregar os dados da solicitação de compra.",
          ),
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    void loadOptions();
  }, []);

  async function toBuyItem(
    item: BuyFormData["items"][number],
  ): Promise<CreateBuyItem> {
    let equipmentId = item.equipmentId?.trim();

    if (item.isNewEquipment) {
      const equipment = await equipmentService.create({
        name: item.equipmentName.trim(),
        unitPrice: 0,
        availableQuantity: 0,
      });
      equipmentId = equipment.id;
    }

    if (!equipmentId) {
      throw new Error(`Selecione o equipamento "${item.equipmentName}" novamente.`);
    }

    return {
      equipmentId,
      quantity: Number(item.quantity),
      technicalSpecification: emptyToUndefined(item.technicalSpecification),
      mechanicalSet: emptyToUndefined(item.mechanicalSet),
    };
  }

  async function onSubmit(formData: BuyFormData) {
    try {
      const items = await Promise.all(formData.items.map(toBuyItem));
      const payload = {
        classGroupId: formData.classGroupId,
        notifiedTeacherId: emptyToUndefined(formData.notifiedTeacherId),
        purchaseJustification: formData.purchaseJustification,
        items,
      };
      const savedBuy = buy
        ? await buyService.update(buy.id, payload)
        : await buyService.create(payload);

      toast.success(
        buy
          ? "Solicitação de compra atualizada com sucesso."
          : "Solicitação de compra enviada com sucesso.",
      );
      router.push(`/compras/${savedBuy.id}`);
      router.refresh();
    } catch (error) {
      applyApiFieldErrors(error, setError);
      toast.error(
        getServiceErrorMessage(
          error,
          buy
            ? "Não foi possível atualizar a solicitação de compra."
            : "Não foi possível enviar a solicitação de compra.",
        ),
      );
    }
  }

  if (!canEdit) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        Esta solicitação não pode mais ser editada porque já foi visualizada ou pertence a outro usuário.
      </div>
    );
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
          <strong className="text-gray-800">
            {new Date(registeredAt).toLocaleString("pt-BR")}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <DropDown
          label="Turma *"
          defaultSelection={loadingOptions ? "Carregando turmas..." : "Selecione a turma"}
          enumData={Object.fromEntries(
            classGroups.map((classGroup) => [classGroup.id, classGroup.acronym]),
          )}
          value={classGroupId}
          onSelect={(value) =>
            setValue("classGroupId", value, { shouldDirty: true, shouldValidate: true })
          }
          disabled={loadingOptions || Boolean(loadError)}
          error={errors.classGroupId?.message}
        />

        <DropDown
          label="Professor a notificar"
          defaultSelection={
            loadingOptions ? "Carregando professores..." : "Nenhum professor específico"
          }
          enumData={Object.fromEntries(
            teachers.map((teacher) => [teacher.id, teacher.name]),
          )}
          value={notifiedTeacherId}
          onSelect={(value) =>
            setValue("notifiedTeacherId", value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          disabled={loadingOptions || Boolean(loadError)}
          error={errors.notifiedTeacherId?.message}
        />
      </div>

      <TextArea
        label="Justificativa da compra *"
        placeholder="Explique por que estes itens são necessários..."
        error={errors.purchaseJustification?.message}
        {...register("purchaseJustification")}
      />

      <section className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-gray-800">Itens da compra *</h3>
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => append({ ...emptyItem })}
          >
            Adicionar item
          </Button>
        </div>

        {errors.items?.message && (
          <p className="text-sm text-red-700">{errors.items.message}</p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => {
            const equipmentId = watchedItems[index]?.equipmentId;
            const equipmentName = watchedItems[index]?.equipmentName;
            const isNewEquipment = watchedItems[index]?.isNewEquipment;

            return (
              <div
                key={field.id}
                className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-12">
                  <div className="md:col-span-9">
                    <EquipamentCombobox
                      options={equipments}
                      value={equipmentId}
                      selectedName={equipmentName}
                      error={errors.items?.[index]?.equipmentName?.message}
                      allowCreate={canCreateEquipment}
                      onChange={(selected) => {
                        if ("isNew" in selected) {
                          setValue(`items.${index}.equipmentId`, "", {
                            shouldValidate: true,
                          });
                          setValue(`items.${index}.isNewEquipment`, true, {
                            shouldValidate: true,
                          });
                          setValue(`items.${index}.equipmentName`, selected.name, {
                            shouldValidate: true,
                          });
                          setValue(`items.${index}.patrimony`, "");
                          setValue(`items.${index}.tag`, "");
                          setValue(`items.${index}.sap`, "");
                        } else {
                          setValue(`items.${index}.equipmentId`, selected.id, {
                            shouldValidate: true,
                          });
                          setValue(`items.${index}.isNewEquipment`, false, {
                            shouldValidate: true,
                          });
                          setValue(`items.${index}.equipmentName`, selected.name, {
                            shouldValidate: true,
                          });
                          setValue(`items.${index}.patrimony`, selected.patrimony || "");
                          setValue(`items.${index}.tag`, selected.tag || "");
                          setValue(`items.${index}.sap`, selected.sap || "");
                        }
                      }}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Input
                      type="number"
                      min={1}
                      label="Quantidade *"
                      placeholder="1"
                      error={errors.items?.[index]?.quantity?.message}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Status:{" "}
                  <strong className={isNewEquipment ? "text-weg-negative" : "text-weg-positive"}>
                    {isNewEquipment
                      ? "Novo equipamento (será cadastrado)"
                      : equipmentId
                        ? "Equipamento existente selecionado"
                        : "Aguardando seleção"}
                  </strong>
                </p>

                <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-3 md:grid-cols-4">
                  <Input
                    label="Patrimônio"
                    placeholder={isNewEquipment ? "Gerado automaticamente" : "Preenchido pelo equipamento"}
                    readOnly
                    className="bg-gray-100"
                    {...register(`items.${index}.patrimony`)}
                  />
                  <Input
                    label="TAG"
                    placeholder={isNewEquipment ? "Gerada automaticamente" : "Preenchida pelo equipamento"}
                    readOnly
                    className="bg-gray-100"
                    {...register(`items.${index}.tag`)}
                  />
                  <Input
                    label="Código SAP"
                    placeholder={isNewEquipment ? "Gerado automaticamente" : "Preenchido pelo equipamento"}
                    readOnly
                    className="bg-gray-100"
                    {...register(`items.${index}.sap`)}
                  />
                  <Input
                    label="Conjunto mecânico"
                    placeholder="Ex: Eixo árvore"
                    {...register(`items.${index}.mechanicalSet`)}
                  />
                </div>

                <TextArea
                  label="Especificação técnica do item"
                  placeholder="Detalhes técnicos sobre o item ou peça de reposição necessária..."
                  {...register(`items.${index}.technicalSpecification`)}
                />

                <div className="flex justify-end border-t border-gray-100 pt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    icon={Trash2}
                    iconOnly
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    aria-label={`Remover item ${index + 1}`}
                    title={`Remover item ${index + 1}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {loadError && <p className="text-sm text-weg-negative">{loadError}</p>}

      <div className="flex justify-end border-t border-gray-100 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || loadingOptions || Boolean(loadError)}
        >
          {isSubmitting
            ? "Salvando..."
            : buy
              ? "Salvar alterações"
              : "Enviar solicitação de compra"}
        </Button>
      </div>
    </form>
  );
}
