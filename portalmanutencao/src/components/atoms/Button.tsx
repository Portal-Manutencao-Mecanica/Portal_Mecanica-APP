import { ButtonProps } from '@/props/Button';

export default function Button({
    variant = 'primary',
    icon: Icon,
    children,
    ...props
}: ButtonProps) {

    const baseStyle = "p-2 rounded-lg font-medium transition-all duration-100 flex items-center justify-center gap-2 active:scale-[0.98] border";

    const variants = {
        primary: "bg-[#00579D] text-[#FAFAFA] hover:bg-[#00579D]/85 hover:border-[#00579D] shadow-sm",
    }

    return (
        <button 
        className={`${baseStyle} ${variants[variant]}`}
        {...props}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
        </button>
    );
}
