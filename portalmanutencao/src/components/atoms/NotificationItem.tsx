import { NotificationItemProps } from "@/props/NotificationItemProps";

export default function NotificationItem({ title, about, isUnread = false, onClick }: NotificationItemProps) {
    return (
        <div 
            onClick={onClick}
            className="group px-4 py-2.5 hover:bg-weg-blue/85 hover:text-[#FAFAFA] cursor-pointer flex flex-col transition-colors"
        >
            <div className="flex items-center justify-between">
                <span className={`text-sm ${isUnread ? 'font-bold text-weg-blue group-hover:text-white' : 'font-medium'}`}>
                    {title}
                </span>
                
                {isUnread && (
                    <span className="h-2 w-2 rounded-full bg-red-500" aria-label="Não lida" />
                )}
            </div>
            
            <span className="text-xs text-gray-500 group-hover:text-white/80 mt-0.5">
                {about}
            </span>
        </div>
    );
}