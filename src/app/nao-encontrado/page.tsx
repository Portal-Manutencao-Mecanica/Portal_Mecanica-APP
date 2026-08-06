import StatusPage from "@/components/molecules/StatusPage";

export default function ResourceNotFoundPage() {
  return (
    <StatusPage
      kind="not-found"
      code="404"
      title="Registro não encontrado"
      description="O registro solicitado não existe ou não está mais disponível."
    />
  );
}
