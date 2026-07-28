"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

interface MachineForm {
    patrimony: string;
    name: string;
    place: string;
    condition: "ATIVA" | "MANUTENCAO" | "INATIVA";
    tag: string;
    description: string;
}

export default function CreateMachinePage() {
    const router = useRouter();

    // Estado inicial com os campos limpos
    const [formData, setFormData] = useState<MachineForm>({
        patrimony: "",
        name: "",
        place: "",
        condition: "ATIVA",
        tag: "",
        description: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Aqui você enviará os dados para sua API ou banco de dados
        console.log("Nova máquina cadastrada:", formData);

        // Redireciona de volta para a lista de máquinas após salvar
        router.push("/maquinas");
    };

    return (
        <LayoutDesktop>
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

                {/* Cabeçalho */}
                <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Cadastrar Nova Máquina
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Preencha os campos abaixo para registrar um novo equipamento no sistema.
                    </p>
                </div>

                {/* Formulário de Cadastro */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        Informações do Equipamento
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Patrimônio */}
                        <div>
                            <label htmlFor="patrimony" className="block text-sm font-medium text-gray-700 mb-1">
                                Nº de Patrimônio *
                            </label>
                            <input
                                type="text"
                                id="patrimony"
                                name="patrimony"
                                value={formData.patrimony}
                                onChange={handleChange}
                                placeholder="Ex: 100004"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00579D] focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Nome */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nome da Máquina *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Torno Mecânico"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00579D] focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Localização */}
                        <div>
                            <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-1">
                                Localização / Setor *
                            </label>
                            <input
                                type="text"
                                id="place"
                                name="place"
                                value={formData.place}
                                onChange={handleChange}
                                placeholder="Ex: Laboratório C"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00579D] focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Condição / Status */}
                        <div>
                            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                                Condição *
                            </label>
                            <select
                                id="condition"
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00579D] focus:border-transparent text-sm bg-white"
                            >
                                <option value="ATIVA">Ativa</option>
                                <option value="MANUTENCAO">Manutenção</option>
                                <option value="INATIVA">Inativa</option>
                            </select>
                        </div>

                        {/* Tag / Categoria */}
                        <div className="md:col-span-2">
                            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                                Tag / Categoria
                            </label>
                            <input
                                type="text"
                                id="tag"
                                name="tag"
                                value={formData.tag}
                                onChange={handleChange}
                                placeholder="Ex: CNC, 3D, FRESA"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00579D] focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Descrição */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Informe uma breve descrição sobre o estado ou uso da máquina..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00579D] focus:border-transparent text-sm"
                            />
                        </div>

                    </div>

                    {/* Botões do Formulário */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <Link href="/maquinas">
                            <Button type="button" variant="secondary">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" variant="primary">
                            Cadastrar Máquina
                        </Button>
                    </div>

                </form>

            </div>
        </LayoutDesktop>
    );
}