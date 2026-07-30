import Link from "next/link";
import { NotificationItemProps } from "@/props/NotificationItemProps";

export default function NotificationItem({
  id,
  title,
  about,
  isUnread = false,
  onClick,
}: NotificationItemProps) {
  return (
    <Link
      href={`/notificacoes/${id}`} 
      onClick={onClick} 
      className="group px-4 py-2.5 hover:bg-weg-blue hover:text-white cursor-pointer flex flex-col transition-colors border-b border-gray-100 last:border-none"
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${
            isUnread
              ? "font-bold text-weg-blue group-hover:text-white"
              : "font-medium text-gray-800 group-hover:text-white"
          }`}
        >
          {title}
        </span>

        {isUnread && (
          <span
            className="h-2 w-2 rounded-full bg-red-500 shrink-0"
            aria-label="Não lida"
          />
        )}
      </div>

      <span className="text-xs text-gray-500 group-hover:text-white/80 mt-0.5 line-clamp-1">
        {about}
      </span>
    </Link>
  );
}