import StatusPage from "@/components/molecules/StatusPage";

export default function InternalErrorPage() {
  return (
    <StatusPage
      kind="error"
      code="500"
      title="Não foi possível concluir a solicitação"
      description="Ocorreu um erro interno. Nenhum detalhe técnico foi exibido; tente novamente em instantes."
      retry
    />
  );
}
