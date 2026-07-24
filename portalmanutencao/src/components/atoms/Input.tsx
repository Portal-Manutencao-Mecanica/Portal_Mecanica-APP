import { InputProps } from "@/props/InputProps";
import { forwardRef, useState } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, maxLength, onChange, className = '', ...props }, ref) => {
        const [currentLength, setCurrentLength] = useState(0);

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentLength(event.target.value.length);
            if (onChange) onChange(event);
        };

        return (
            <div className="w-full flex flex-col gap-1.5 ">
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <div
                    className={`
                    flex items-center justify-between px-4 py-2 border rounded-lg bg-white text-sm
                    transition-all duration-200 ease-out hover:border-[#3498db]
                    focus-within:border-[#3498db] shadow-sm

                    active:ring-4
                    active:ring-[#3498db]/30 
                    active:scale-[0.99]
            ${error ? 'border-red-500 hover:ring-red-200' : 'border-gray-200'}
            ${className}
                    `}
                >
                    <input
                        ref={ref}
                        maxLength={maxLength}
                        onChange={handleInputChange}
                        className="w-full bg-transparent outline-none border-none text-black placeholder-gray-400 italic"
                        {...props}
                    />
                    {maxLength && (
                        <span className="text-xs text-gray-400 italic select-none pl-2 whitespace-nowrap">
                            {currentLength}/{maxLength}
                        </span>
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
);

Input.displayName = 'Input';

export default Input;

