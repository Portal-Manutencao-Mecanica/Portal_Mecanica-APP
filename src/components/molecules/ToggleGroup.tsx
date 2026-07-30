'use client';

import ToggleButton from "@/components/atoms/ToggleButton";
import { ToggleGroupProps } from "@/props/ToggleGroupProps";

const ToggleGroup = ({ options, value, onChange }: ToggleGroupProps) => {
    return (
        <div className="flex items-center gap-3">
            {options.map((option) => (
                <ToggleButton
                    key={option.value}
                    label={option.label}
                    checked={value === option.value}
                    onToggle={() => onChange(option.value)}
                    className="px-4! py-2! text-sm! rounded-lg!"
                />
            ))}
        </div>
    );
};

export default ToggleGroup;