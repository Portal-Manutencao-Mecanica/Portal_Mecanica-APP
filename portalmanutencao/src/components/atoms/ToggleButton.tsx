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
                inline-flex min-h-10 items-center justify-center rounded-lg border px-4 py-2
                text-sm font-semibold shadow-sm outline-none transition-all duration-150
                focus-visible:ring-3 focus-visible:ring-weg-blue/25 active:scale-[0.98]
                ${currentChecked
                    ? 'border-weg-blue bg-weg-blue text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${className}
            `}
            {...props}
        >
            {label}
        </button>
    );
};

export default ToggleButton;
