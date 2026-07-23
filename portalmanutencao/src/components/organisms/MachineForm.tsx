"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot"; // 👈 IMPORT QUE FALTAVA!

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import DropDown from "@/components/atoms/DropDown";
import TextArea from "../atoms/TextArea";


const CONDITION_OPTIONS = {
    ATIVA: "ATIVA",
    MANUTENCAO: "MANUTENCAO",
    INATIVA: "INATIVA",
};

// 2. Schema de validação do Valibot (fora do componente para evitar recriação no render)
const machineSchema = v.object({
    patrimony: v.pipe(
        v.string(),
        v.nonEmpty("Informe o número de patrimônio.")
    ),
    name: v.pipe(
        v.string(),
        v.minLength(3, "O nome da máquina deve ter pelo menos 3 caracteres.")
    ),
    place: v.pipe(
        v.string(),
        v.nonEmpty("Informe o setor ou localização.")
    ),
    condition: v.picklist(["ATIVA", "MANUTENCAO", "INATIVA"]),
    tag: v.optional(v.string()),
    description: v.optional(v.string()),
});

// Tipagem automática inferida pelo Valibot
type MachineFormData = v.InferInput<typeof machineSchema>;

export default function MachineForm() {
    const router = useRouter();

    // 3. Gerenciamento do formulário
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<MachineFormData>({
        resolver: valibotResolver(machineSchema),
        defaultValues: {
            patrimony: "",
            name: "",
            place: "",
            condition: "ATIVA",
            tag: "",
            description: "",
        },
    });

    const onSubmit = (data: MachineFormData) => {
        console.log("Formulário validado com sucesso:", data);
        router.push("/maquinas");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Informações do Equipamento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patrimônio */}
                <div>
                    <label htmlFor="patrimony" className="block text-sm font-medium text-gray-700 mb-1">
                        Nº de Patrimônio *
                    </label>
                    <Input
                        id="patrimony"
                        placeholder="Ex: 100004"
                        {...register("patrimony")}
                    />
                    {errors.patrimony && (
                        <p className="text-weg-negative text-xs mt-1">{errors.patrimony.message}</p>
                    )}
                </div>

                {/* Nome */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Máquina *
                    </label>
                    <Input
                        id="name"
                        placeholder="Ex: Torno Mecânico"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-weg-negative text-xs mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Localização */}
                <div>
                    <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">
                        Localização / Setor *
                    </label>
                    <Input
                        id="place"
                        placeholder="Ex: Laboratório C"
                        {...register("place")}
                    />
                    {errors.place && (
                        <p className="text-weg-negative text-xs mt-1">{errors.place.message}</p>
                    )}
                </div>

                {/* Condição (Usando o seu DropDown customizado) */}
                <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                        Condição *
                    </label>
                    <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                            <DropDown
                                defaultSelection="Selecione a condição"
                                enumData={CONDITION_OPTIONS}
                                onSelect={(value) => field.onChange(value)} qty={0}  />
                        )}
                    />
                    {errors.condition && (
                        <p className="text-weg-negative text-xs mt-1">{errors.condition.message}</p>
                    )}
                </div>

                {/* Tag */}
                <div className="md:col-span-2">
                    <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                        Tag / Categoria
                    </label>
                    <Input
                        id="tag"
                        placeholder="Ex: CNC, 3D, FRESA"
                        {...register("tag")}
                    />
                    {errors.tag && (
                        <p className="text-weg-negative text-xs mt-1">{errors.tag.message}</p>
                    )}
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                    
                    
                    <TextArea label={"Descrição"} error={""} placeholder="Insira uma descrição da Máquina"></TextArea>
                    
                    {errors.description && (
                        <p className="text-weg-negative text-xs mt-1">{errors.description.message}</p>
                    )}
                </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Link href="/maquinas">
                    <Button type="button" variant="secondary">
                        Cancelar
                    </Button>
                </Link>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    Cadastrar Máquina
                </Button>
            </div>
            
        </form>
    );
    console.log(isSubmitting)
}