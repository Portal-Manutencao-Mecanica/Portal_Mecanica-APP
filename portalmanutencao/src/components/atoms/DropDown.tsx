"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropDownProps } from "@/props/DropDownProps";

interface ExtendedDropDownProps<T extends Record<string, string>> extends DropDownProps<T> {
    label?: string;
    error?: string;
    className?: string;
}

export default function DropDown<T extends Record<string, string>>({
    defaultSelection,
    qty,
    enumData,
    onSelect,
    label,
    error,
    className = "",
    value
}: ExtendedDropDownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(value || "");
    const containerRef = useRef<HTMLDivElement>(null);

    const safeData = enumData ?? {};
    const keys = Object.keys(safeData).filter((key) => isNaN(Number(key)));

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsOpen(false);
        e.target.blur(); // Remove o foco para resetar os estados active/focus do container
        onSelect(e.target.value as unknown as T[keyof T]);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectOption = (optionValue: string) => {
        setSelectedValue(optionValue);
        setIsOpen(false);
        if (onSelect) {
            onSelect(optionValue as unknown as T[keyof T]);
        }
    };

    return (
        <div className="w-full flex flex-col gap-1.5 relative" ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {/* Container Principal do Select */}
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className={`
                    relative flex items-center justify-between px-4 py-2 border rounded-lg bg-white text-sm cursor-pointer select-none
                    transition-all duration-200 ease-out hover:border-[#3498db] shadow-sm
                    ${isOpen ? 'border-[#3498db]  ring-[#3498db]/30' : ''}
                    ${error ? 'border-red-500 hover:ring-red-200' : 'border-gray-200'}
                    ${className}
                `}
            >
                <span className={selectedValue ? "text-gray-800 font-normal" : "text-gray-400 italic"}>
                    {selectedValue || defaultSelection}
                </span>

                <ChevronDown 
                    className={`
                        h-4 w-4 text-gray-400 transition-transform duration-200 ease-out
                        ${isOpen ? 'rotate-180 text-[#3498db]' : ''}
                    `} 
                />

                {/* Menu suspenso flutuante com largura exata do input (left-0 right-0 w-full) */}
                {isOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in-50 zoom-in-95 duration-150">
                        {/* Opção Padrão (Reset/Placeholder) */}
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectOption("");
                            }}
                            className="px-4 py-2.5 text-sm text-gray-400 italic hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        >
                            {defaultSelection}
                        </div>

                        {/* Mapeamento das opções estilizadas */}
                        {keys.map((key) => {
                            const val = safeData[key];
                            const isSelected = selectedValue === val;

                            return (
                                <div
                                    key={key}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectOption(val);
                                    }}
                                    className={`
                                        px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between
                                        ${isSelected ? 'bg-weg-blue/80 text-white font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-weg-blue'}
                                    `}
                                >
                                    {val}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {error && (
                <span className="text-xs font-medium text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}

function setSelectedValue(optionValue: string) {
    throw new Error("Function not implemented.");
}
