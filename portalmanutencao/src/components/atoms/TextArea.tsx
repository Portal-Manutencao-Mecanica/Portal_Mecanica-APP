import { TextAreaProps } from "@/props/TextAreaProps";
import { forwardRef, useId, useState } from "react";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, maxLength, onChange, rows = 4, className = '', ...props }, ref) => {
        const [currentLength, setCurrentLength] = useState(0);
        const generatedId = useId();
        const textareaId = props.id ?? generatedId;
        const errorId = `${textareaId}-error`;

        const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCurrentLength(event.target.value.length);
            if (onChange) onChange(event);
        };

        return (
            <div className="w-full flex flex-col gap-1.5">
                {/* Label */}
                {label && (
                    <label className="ui-field-label" htmlFor={textareaId}>
                        {label}
                    </label>
                )}

                {/* Wrapper da Caixa de Texto */}
                <div
                    className={`
                        flex items-start justify-between rounded-lg border bg-white px-3 shadow-sm
                        transition-colors focus-within:ring-3
                        ${error ? 'border-red-500 focus-within:ring-red-100' : 'border-gray-300 hover:border-gray-400 focus-within:border-weg-blue focus-within:ring-weg-blue/15'}
                        ${props.disabled ? "cursor-not-allowed bg-gray-100 opacity-70" : ""}
                        ${className}
                    `}
                >
                    <textarea
                        ref={ref}
                        id={textareaId}
                        rows={rows}
                        maxLength={maxLength}
                        onChange={handleTextareaChange}
                        aria-describedby={error ? errorId : props["aria-describedby"]}
                        aria-invalid={Boolean(error)}
                        className="w-full resize-y bg-transparent py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
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
                    <span id={errorId} className="text-xs font-medium text-red-600" role="alert">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;
