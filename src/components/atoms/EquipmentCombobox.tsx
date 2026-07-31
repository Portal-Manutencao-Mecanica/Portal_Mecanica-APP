import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { EquipmentComboboxProps } from "@/props/EquipmentComboboxProps";

export default function EquipamentCombobox({
    options,
    value,
    selectedName,
    onChange,
    error,
}: EquipmentComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Tenta achar o equipamento pelo ID
    const selectedEquipment = options.find((opt) => opt.id === value);

    // Se achou nas opções, formata. Se não, usa o selectedName que veio do formulário
    const displayName = selectedEquipment
        ? `${selectedEquipment.name}${selectedEquipment.patrimony ? ` (Pat: ${selectedEquipment.patrimony})` : ""}`
        : selectedName || "";

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

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-2.5 bg-white border rounded-lg text-sm flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"
                    }`}
            >
                <span className={displayName ? "text-gray-900 font-medium" : "text-gray-400"}>
                    {displayName || "Pesquisar por nome, patrimônio ou TAG..."}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
            </div>

            {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}

            {/* Menu Dropdown */}
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

                    <ul className="max-h-56 overflow-y-auto divide-y  divide-gray-50 text-sm">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <li
                                    key={opt.id}
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                    // 1. Adicionado 'group' aqui no li
                                    className="group p-2.5 hover:bg-weg-blue cursor-pointer flex items-center justify-between transition-colors"
                                >
                                    <div>
                                        {/* 2. Alterado para group-hover:text-white */}
                                        <span className="block text-semi-bold text-gray-800 group-hover:text-white transition-colors">
                                            {opt.name}
                                        </span>
                                        {/* 3. Ajustado para group-hover:text-blue-100 (ou white) */}
                                        <span className="text-xs text-gray-500 group-hover:text-blue-100 transition-colors">
                                            {opt.patrimony && `Pat: ${opt.patrimony} `}
                                            {opt.tag && `| TAG: ${opt.tag}`}
                                        </span>
                                    </div>

                                    {(opt.id === value || opt.name === selectedName) && (
                                        /* Dica extra: Se quiser que o ícone do Check também fique branco no hover */
                                        <Check className="w-4 h-4 text-weg-blue group-hover:text-white transition-colors" />
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="p-3 text-center text-xs text-gray-500">
                                Nenhum equipamento encontrado com "{searchTerm}".
                            </li>
                        )}

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