import { TextAreaProps } from "@/props/TextAreaProps";
import { forwardRef, useId, useState } from "react";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ id, label, error, maxLength, onChange, rows = 4, className = '', ...props }, ref) => {
        const [currentLength, setCurrentLength] = useState(0);
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const errorId = `${inputId}-error`;

        const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCurrentLength(event.target.value.length);
            if (onChange) onChange(event);
        };

        return (
            <div className="w-full flex flex-col gap-1.5">
                {/* Label */}
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                {/* Wrapper da Caixa de Texto */}
                <div
                    className={`
                        flex items-start justify-between rounded-lg border bg-white px-4 py-2 text-sm shadow-sm
                        transition-colors hover:border-weg-blue/60 focus-within:border-weg-blue focus-within:ring-2 focus-within:ring-weg-blue/20
                        ${error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200' : 'border-gray-200'}
                        ${className}
                    `}
                >
                    <textarea
                        ref={ref}
                        id={inputId}
                        rows={rows}
                        maxLength={maxLength}
                        onChange={handleTextareaChange}
                        aria-describedby={error ? errorId : undefined}
                        className="w-full resize-none border-none bg-transparent text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                        {...props}
                    />

                    {/* Contador de Caracteres */}
                    {maxLength && (
                        <span className="text-xs text-gray-400 italic select-none pl-2 whitespace-nowrap self-end">
                            {currentLength}/{maxLength}
                        </span>
                    )}
                </div>

                {/* Mensagem de Erro */}
                {error && (
                    <span id={errorId} className="text-sm text-red-700">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;
