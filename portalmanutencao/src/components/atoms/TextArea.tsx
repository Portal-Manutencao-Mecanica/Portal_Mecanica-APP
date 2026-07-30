import { TextAreaProps } from "@/props/TextAreaProps";
import { forwardRef, useState } from "react";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, maxLength, onChange, rows = 4, className = '', ...props }, ref) => {
        const [currentLength, setCurrentLength] = useState(0);

        const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCurrentLength(event.target.value.length);
            if (onChange) onChange(event);
        };

        return (
            <div className="w-full flex flex-col gap-1.5">
                {/* Label */}
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                {/* Wrapper da Caixa de Texto */}
                <div
                    className={`
                        flex items-start justify-between px-4 py-2 border rounded-lg bg-white text-sm
                        transition-all duration-200 ease-out hover:border-[#3498db]
                        focus-within:border-[#3498db] shadow-sm

                        active:ring-4
                        active:ring-[#3498db]/30 
                        active:scale-[0.99]
                        ${error ? 'border-red-500 hover:ring-red-200' : 'border-gray-200'}
                        ${className}
                    `}
                >
                    <textarea
                        ref={ref}
                        rows={rows}
                        maxLength={maxLength}
                        onChange={handleTextareaChange}
                        className="w-full bg-transparent outline-none border-none text-black placeholder-gray-400 italic resize-none"
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
                    <span className="text-xs font-medium text-red-500">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;