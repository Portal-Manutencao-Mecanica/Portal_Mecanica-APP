import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { EquipmentComboboxProps } from "@/props/EquipmentComboboxProps";

export default function EquipamentCombobox({
    options,
    value,
    onChange,
    error,
}: EquipmentComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedEquipment = options.find((opt) => opt.id === value);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(
        (opt) =>
            opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opt.patrimony?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opt.tag?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipamento *
            </label>

            {/* Input de Seleção / Gatilho */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-2.5 bg-white border rounded-lg text-sm flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            >
                <span className={selectedEquipment ? "text-gray-900" : "text-gray-400"}>
                    {selectedEquipment
                        ? `${selectedEquipment.name} ${
                              selectedEquipment.patrimony
                                  ? `(Pat: ${selectedEquipment.patrimony})`
                                  : ""
                          }`
                        : "Pesquisar por nome, patrimônio ou TAG..."}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
            </div>

            {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}

            {/* Menu Dropdown Pesquisável */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            autoFocus
                            className="w-full bg-transparent text-sm focus:outline-none text-gray-800"
                            placeholder="Digite para buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <ul className="max-h-56 overflow-y-auto divide-y divide-gray-50 text-sm">
                        {filteredOptions.length > 0 ? (
                            // Removida a tipagem gigante manual - 'opt' é inferido automaticamente
                            filteredOptions.map((opt) => (
                                <li
                                    key={opt.id}
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                    className="p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                                >
                                    <div>
                                        <strong className="block text-gray-800">{opt.name}</strong>
                                        <span className="text-xs text-gray-500">
                                            {opt.patrimony && `Pat: ${opt.patrimony} `}
                                            {opt.tag && `| TAG: ${opt.tag}`}
                                        </span>
                                    </div>
                                    {opt.id === value && (
                                        <Check className="w-4 h-4 text-blue-600" />
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="p-3 text-center text-xs text-gray-500">
                                Nenhum equipamento encontrado com "{searchTerm}".
                            </li>
                        )}

                        {/* Opção dinâmica de Criar Novo Equipamento */}
                        {searchTerm.trim() !== "" && (
                            <li
                                onClick={() => {
                                    onChange({ isNew: true, name: searchTerm });
                                    setIsOpen(false);
                                    setSearchTerm("");
                                }}
                                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer flex items-center gap-2 font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Cadastrar novo: "{searchTerm}"</span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}