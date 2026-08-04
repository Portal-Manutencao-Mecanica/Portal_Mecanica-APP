import Button from "@/components/atoms/Button";
import PageHeader from "@/components/molecules/PageHeader";
import { NotificationDetailProps } from "@/props/NotificationDetailProps";
import LabelWithCircle from "../molecules/LabelWithCircle";

export default function NotificationDetailSection({
  notification,
  onMarkAsRead,
}: NotificationDetailProps) {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Detalhes da notificação"
        description={notification.about ?? "Visualize a mensagem recebida."}
        actions={
          <div className="flex flex-wrap items-center gap-3">
          {notification.statusRead ? (
            <LabelWithCircle status="positive" text="Lida" />
          ) : (
            <LabelWithCircle status="negative" text="Não lida" />
          )}

          {onMarkAsRead && (
            <Button
              variant={notification.statusRead ? "primary" : "secondary"}
              onClick={onMarkAsRead}
            >
              {notification.statusRead
                ? "Marcar como não lida"
                : "Marcar como lida"}
            </Button>
          )}
          </div>
        }
      />

      <div className="space-y-6 rounded-xl bg-weg-card-white p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-weg-blue">
            {notification.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Destinatário:</span>
          <span>{notification.email}</span>
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            Mensagem
          </span>
          <div className="rounded-lg bg-gray-50/50 p-4 text-base leading-relaxed whitespace-pre-line text-gray-800">
            {notification.description}
          </div>
        </div>
      </div>
    </section>
  );
}
