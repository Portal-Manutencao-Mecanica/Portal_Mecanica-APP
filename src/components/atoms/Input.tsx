'use client'

import { InputProps } from "@/props/InputProps";
import { forwardRef, useId, useState } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ id, label, error, maxLength, onChange, className = '', ...props }, ref) => {
        const [currentLength, setCurrentLength] = useState(0);
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const errorId = `${inputId}-error`;

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentLength(event.target.value.length);
            if (onChange) onChange(event);
        };

        return (
            <div className="flex w-full flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <div
                    className={`
                    flex min-h-10 items-center justify-between rounded-lg border bg-white px-4 py-2 text-sm shadow-sm
                    transition-colors hover:border-weg-blue/60 focus-within:border-weg-blue focus-within:ring-2 focus-within:ring-weg-blue/20
            ${error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200' : 'border-gray-200'}
            ${className}
                    `}
                >
                    <input
                        ref={ref}
                        id={inputId}
                        maxLength={maxLength}
                        onChange={handleInputChange}
                        aria-describedby={error ? errorId : undefined}
                        className="w-full border-none bg-transparent text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                        {...props}
                    />
                    {maxLength && (
                        <span className="text-xs text-gray-400 italic select-none pl-2 whitespace-nowrap">
                            {currentLength}/{maxLength}
                        </span>
                    )}
                </div>


                {error && (
                    <span id={errorId} className="text-sm text-red-700">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

