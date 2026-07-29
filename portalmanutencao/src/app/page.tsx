import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default function Home() {
    return (
      <LayoutDesktop>
        <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Portal da Manutenção</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Acompanhe turmas, equipamentos, máquinas, ocorrências e notificações em um só lugar.
          </p>
        </section>
      </LayoutDesktop>
    );
}
