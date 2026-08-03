import MaintenceForm from "@/components/organisms/MaintenceForm";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

export default async function EditOccurrencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <LayoutDesktop>
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Editar ocorrência</h1>
        <MaintenceForm occurrenceId={id} />
      </main>
    </LayoutDesktop>
  );
}
