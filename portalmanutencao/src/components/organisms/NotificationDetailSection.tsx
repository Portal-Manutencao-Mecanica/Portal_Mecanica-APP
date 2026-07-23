import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import { NotificationDetailProps } from "@/props/NotificationDetailProps";

export default function NotificationDetailSection({
  notification,
  onMarkAsRead,
}: NotificationDetailProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Cabeçalho de Ações */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Detalhes da Notificação
          </h1>
        </div>

        {/* Status com LabelWithCircle e Botão Dinâmico */}
        <div className="flex items-center gap-3">
          {notification.statusRead ? (
            <LabelWithCircle
              status="positive"
              text="Lida"
              size="sm"
            />
          ) : (
            <LabelWithCircle
              status="negative"
              text="Não lida"
              size="sm"
            />
          )}

          {onMarkAsRead && (
            <Button
              /* 🎯 Se estiver lida, aplica a variante 'primary' (Azul), se não, 'secondary' */
              variant={notification.statusRead ? "primary" : "secondary"}
              onClick={onMarkAsRead}
            >
              {notification.statusRead
                ? "Marcar como não lida"
                : "Marcar como lida"}
            </Button>
          )}
        </div>
      </div>

      {/* Card com os Dados */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4 space-y-1">
          <h2 className="text-2xl font-bold text-weg-blue">
            {notification.title}
          </h2>
          {notification.about && (
            <p className="text-base font-medium text-gray-600">
              {notification.about}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="font-semibold text-gray-700">Destinatário:</span>
          <span>{notification.email}</span>
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            Mensagem
          </span>
          <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-lg border border-gray-200">
            {notification.description}
          </div>
        </div>
      </div>
    </div>
  );
}