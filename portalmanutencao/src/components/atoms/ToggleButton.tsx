'use client';

import { ToggleButtonProps } from "@/props/ToggleButtonProps";
import React, { useState } from "react";

const ToggleButton = ({
    label,
    checked: propsChecked,
    defaultChecked = false,
    onToggle,
    disabled = false,
    className = '',
    ...props
}: ToggleButtonProps) => {
    const isControlled = propsChecked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const currentChecked = isControlled ? propsChecked : internalChecked;

    const handleToggle = (event?: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;

        const newCheckedState = !currentChecked;

        if (!isControlled) {
            setInternalChecked(newCheckedState);
        }

        if (onToggle) {
            onToggle(newCheckedState);
        }

        if (props.onClick && event) {
            props.onClick(event);
        }
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={currentChecked}
            disabled={disabled}
            onClick={handleToggle}
            className={`
                /* Estrutura base seguindo a imagem */
                inline-flex items-center justify-center p-2 font-bold text-lg rounded-lg border
                transition-all duration-100 ease-out outline-none select-none shadow-sm
                
                /* Efeito físico de clique rápido (pulsada sutil ao pressionar) */
                active:scale-[0.97]
                active:ring-4 active:ring-gray-400/20

                /* 🎨 ESTADOS DO DESIGN DA IMAGEM: */
                ${currentChecked 
                    ? 'bg-[#27272A] border-transparent text-white' // Ativo: Escuro, sem borda e texto branco (Estilo PDF)
                    : 'bg-white border-[#88888C] text-black hover:bg-gray-50' // Inativo: Branco, borda cinza e texto preto (Estilo CSV)
                }
                
                /* Estado desabilitado */
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${className}
            `}
            {...props}
        >
            {/* O texto agora fica centralizado dentro do próprio botão */}
            {label}
        </button>
    );
};

export default ToggleButton;