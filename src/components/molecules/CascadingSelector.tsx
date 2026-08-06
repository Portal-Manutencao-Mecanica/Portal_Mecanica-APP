import { CascadingItemProps } from "@/props/CascadingItemProps";
import { CascadingMultiSelectorProps } from "@/props/CascadingMultiSelectorProps";
import { Check, ChevronRight, Tag, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export function CascadingMultiSelect<T extends CascadingItemProps>({
  groups = [],
  value = [],
  onChange,
  label,
  placeholder = "Selecione uma opção...",
  groupHeader = "Categorias",
  itemHeader = "Itens",
  error,
  badgeIcon: BadgeIcon = Tag,
}: CascadingMultiSelectorProps<T>) {
  const [activeGroupId, setActiveGroupId] = useState<string | number | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora do componente
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

  // Mapeia todos os itens de todos os grupos para facilitar a busca
  const allItems = useMemo(() => {
    return groups.flatMap((group) => group.items);
  }, [groups]);

  // Obtém os itens selecionados com base nos IDs passados em 'value'
  const selectedItems = useMemo(() => {
    return allItems.filter((item) => value.includes(item.id));
  }, [allItems, value]);

  // Obtém os itens do grupo que está ativo/hover no momento
  const activeItems = useMemo<T[]>(() => {
    if (!activeGroupId) return [];
    return groups.find((g) => g.id === activeGroupId)?.items || [];
  }, [groups, activeGroupId]);

  // Alterna a seleção de um item
  const toggleItem = (itemId: string | number) => {
    const updatedIds = value.includes(itemId)
      ? value.filter((id) => id !== itemId)
      : [...value, itemId];

    onChange?.(updatedIds);
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Tags dos Itens Selecionados */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedItems.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-weg-blue text-xs font-semibold rounded-full border border-blue-200"
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              {item.name}
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="inline-flex items-center justify-center p-0.5 rounded-md hover:bg-blue-200/60 text-weg-blue transition-colors cursor-pointer ml-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Botão de Abertura */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-4 py-2.5 bg-white border rounded-xl text-sm font-medium flex justify-between items-center transition-all ${
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <span
          className={value.length === 0 ? "text-gray-400" : "text-gray-800"}
        >
          {value.length === 0
            ? placeholder
            : `${value.length} item(ns) selecionado(s)`}
        </span>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Dropdown de 2 Níveis */}
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg flex h-64 overflow-hidden">
          {/* Coluna 1: Grupos */}
          <div className="w-1/2 border-r border-gray-100 overflow-y-auto bg-gray-50/50 p-2 space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase px-2 mb-1 block">
              {groupHeader}
            </span>
            {groups.map((group) => (
              <div
                key={group.id}
                onMouseEnter={() => setActiveGroupId(group.id)}
                onClick={() => setActiveGroupId(group.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  activeGroupId === group.id
                    ? "bg-weg-blue text-white"
                    : "hover:bg-gray-200/70 text-gray-700"
                }`}
              >
                <span>{group.name}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              </div>
            ))}
          </div>

          {/* Coluna 2: Itens do Grupo Selecionado */}
          <div className="w-1/2 overflow-y-auto space-y-1 p-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase px-2 mb-1 block">
              {itemHeader}
            </span>
            {!activeGroupId ? (
              <p className="text-xs text-gray-400 p-2">
                Passe o mouse sobre um grupo...
              </p>
            ) : activeItems.length === 0 ? (
              <p className="text-xs text-gray-400 p-2">
                Nenhum item nesta categoria.
              </p>
            ) : (
              activeItems.map((item) => {
                const isSelected = value.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-weg-blue border border-blue-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <span className="text-xs text-red-500 font-medium block">{error}</span>
      )}
    </div>
  );
}
