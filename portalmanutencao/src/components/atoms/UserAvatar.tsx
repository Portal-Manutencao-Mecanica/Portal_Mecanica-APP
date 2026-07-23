import Link from "next/link";
import { getInitials } from "@/utils/string";
import { UserAvatarProps } from "@/props/UserAvatarProps";

export function UserAvatar({
    user,
    href = "/perfil",
    isExpanded = true,
}: UserAvatarProps) {
    const initials = getInitials(user.name);

    return (
        <Link
            href={href}
            aria-label={`Perfil de ${user.name}`}
            className="flex items-center h-12 rounded-lg transition-colors hover:bg-white/10 cursor-pointer px-3 group select-none"
        >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <div className="w-8 h-8 rounded-full bg-white text-weg-blue flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                    {initials}
                </div>
            </div>

            <div
                className={`whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${isExpanded
                        ? "opacity-100 max-w-xs ml-4"
                        : "opacity-0 max-w-0 ml-0 pointer-events-none"
                    }`}
            >
                <span className="text-sm font-medium truncate leading-tight text-white">
                    {user.name}
                </span>
                {user.role && (
                    <span className="text-[10px] text-white/70 truncate">
                        {user.role}
                    </span>
                )}
            </div>
        </Link>
    );
}