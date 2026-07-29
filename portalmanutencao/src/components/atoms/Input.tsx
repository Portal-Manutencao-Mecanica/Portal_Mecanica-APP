'use client'

import { InputProps } from "@/props/InputProps";
import { forwardRef, useId, useState } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, maxLength, onChange, className = '', ...props }, ref) => {
        const [currentLength, setCurrentLength] = useState(0);
        const generatedId = useId();
        const inputId = props.id ?? generatedId;
        const errorId = `${inputId}-error`;

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentLength(event.target.value.length);
            if (onChange) onChange(event);
        };

        return (
            <div className="flex w-full flex-col gap-1.5">
                {label && (
                    <label className="ui-field-label" htmlFor={inputId}>
                        {label}
                    </label>
                )}

                <div
                    className={`flex min-h-10 items-center rounded-lg border bg-white px-3 shadow-sm transition-colors focus-within:ring-3 ${
                        error
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
                            : "border-gray-300 hover:border-gray-400 focus-within:border-weg-blue focus-within:ring-weg-blue/15"
                    } ${props.disabled ? "cursor-not-allowed bg-gray-100 opacity-70" : ""} ${className}`}
                >
                    <input
                        ref={ref}
                        id={inputId}
                        maxLength={maxLength}
                        onChange={handleInputChange}
                        aria-describedby={error ? errorId : props["aria-describedby"]}
                        aria-invalid={Boolean(error)}
                        className="w-full bg-transparent py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                        {...props}
                    />
                    {maxLength && (
                        <span className="text-xs text-gray-400 italic select-none pl-2 whitespace-nowrap">
                            {currentLength}/{maxLength}
                        </span>
                    )}
                </div>


                {error && (
                    <span id={errorId} className="text-xs font-medium text-red-600" role="alert">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
