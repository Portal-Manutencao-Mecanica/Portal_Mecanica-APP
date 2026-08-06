import StatusPage from "@/components/molecules/StatusPage";

export default function AccessDeniedPage() {
  return (
    <StatusPage
      kind="forbidden"
      code="403"
      title="Acesso negado"
      description="Você está autenticado, mas não possui permissão para acessar este recurso."
    />
  );
}
