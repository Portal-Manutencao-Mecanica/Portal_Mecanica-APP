import StatusPage from "@/components/molecules/StatusPage";

export default function NotFound() {
  return (
    <StatusPage
      kind="not-found"
      code="404"
      title="Página não encontrada"
      description="O endereço informado não existe, foi movido ou o registro não está mais disponível."
    />
  );
}
