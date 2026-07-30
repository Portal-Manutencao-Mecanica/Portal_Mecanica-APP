import { ButtonProps } from '@/props/ButtonProps';

export default function Button({
    variant = 'primary',
    icon: Icon,
    children,
    className = "",
    ...props
}: ButtonProps) {

    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-100 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer";

    const variants = {
        primary: "bg-weg-blue text-[#FAFAFA] hover:bg-[#00579D]/85 shadow-sm",
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm",
        warning: "bg-weg-warn text-slate-900 hover:bg-amber-500 shadow-sm",
        danger: "bg-weg-negative text-white hover:bg-red-700 shadow-sm",
    };

    const selectedVariant = variants[variant] || variants.primary;

    return (
        <button 
            className={`${baseStyle} ${selectedVariant} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
}