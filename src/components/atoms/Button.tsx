import { ButtonProps } from '@/props/ButtonProps';

export default function Button({
    variant = 'primary',
    icon: Icon,
    children,
    className = "",
    type = "button",
    ...props
}: ButtonProps) {

    const baseStyle = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weg-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

    const variants = {
        primary: "bg-weg-blue text-white hover:bg-weg-blue/90",
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        warning: "bg-weg-warning text-gray-900 hover:bg-weg-warning/85",
        danger: "bg-weg-negative text-white hover:bg-weg-negative/85",
    };

    const selectedVariant = variants[variant] || variants.primary;

    return (
        <button 
            type={type}
            className={`${baseStyle} ${selectedVariant} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
}
