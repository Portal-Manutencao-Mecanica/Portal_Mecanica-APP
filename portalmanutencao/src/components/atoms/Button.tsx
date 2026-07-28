import { ButtonProps } from '@/props/ButtonProps';

export default function Button({
    variant = 'primary',
    icon: Icon,
    children,
    className = "",
    ...props
}: ButtonProps) {

    const baseStyle = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-semibold shadow-sm transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-weg-blue/25 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer";

    const variants = {
        primary: "bg-weg-blue text-white hover:bg-[#004a86]",
        secondary: "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50",
        warning: "border-amber-400 bg-weg-warning text-slate-900 hover:bg-amber-400",
        danger: "bg-weg-negative text-white hover:bg-red-700",
    };

    const selectedVariant = variants[variant] || variants.primary;

    return (
        <button 
            className={`${baseStyle} ${selectedVariant} ${className}`}
            {...props}
        >
            {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
            {children}
        </button>
    );
}
