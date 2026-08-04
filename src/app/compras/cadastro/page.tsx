import BuyForm from "@/components/organisms/BuyForm";
import PageHeader from "@/components/molecules/PageHeader";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default function BuyFormPage() {
  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Nova solicitação de compra"
          description="Informe a turma, os itens necessários e a justificativa da solicitação."
        />
        <BuyForm />
      </section>
    </LayoutDesktop>
  );
}
