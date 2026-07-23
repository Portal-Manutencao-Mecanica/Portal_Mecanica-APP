import Link from "next/link";
import Button from "@/components/atoms/Button";
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
          <Link href="/notificacoes">
            <Button variant="secondary">Voltar</Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Detalhes da Notificação
          </h1>
        </div>

        {/* Indicador de Status e Ação */}
        <div className="flex items-center gap-3">
          {!notification.statusRead ? (
            <>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                Não lida
              </span>
              {onMarkAsRead && (
                <Button variant="secondary" onClick={onMarkAsRead}>
                  Marcar como lida
                </Button>
              )}
            </>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
              Lida
            </span>
          )}
        </div>
      </div>

      {/* Card com os Dados */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        {/* Título e Subtítulo */}
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

        {/* Destinatário */}
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span className="font-semibold text-gray-700">Destinatário:</span>
          <span>{notification.email}</span>
        </div>

        {/* Corpo do Texto */}
        <div className="space-y-2 pt-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
            Mensagem
          </span>
          <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-lg border border-gray-100">
            {notification.description}
          </div>
        </div>
      </div>
    </div>
  );
}
