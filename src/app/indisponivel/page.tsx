import StatusPage from "@/components/molecules/StatusPage";

export default function ServiceUnavailablePage() {
  return (
    <StatusPage
      kind="unavailable"
      code="503"
      title="Serviço temporariamente indisponível"
      description="A API de manutenção não respondeu no momento. Aguarde alguns instantes e tente novamente."
      retry
    />
  );
}
