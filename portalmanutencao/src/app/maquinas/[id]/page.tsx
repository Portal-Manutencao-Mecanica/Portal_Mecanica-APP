import Link from "next/link";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

// Dados simulados para o exemplo (no futuro você buscará do banco/API usando o params.id)
const machineData = {
  id: 1,
  patrimony: "100001",
  name: "Torno CNC",
  place: "Laboratório A",
  condition: "ATIVA" as "ATIVA" | "MANUTENCAO" | "INATIVA",
  tag: "CNC",
  description: "Equipamento utilizado para usinagem de peças cilíndricas de alta precisão.",
  createdAt: "10/01/2024",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function ViewMachinePage({ params }: PageProps) {
  const status =
    machineData.condition === "ATIVA"
      ? "positive"
      : machineData.condition === "MANUTENCAO"
      ? "warning"
      : "negative";

  const statusText =
    machineData.condition === "ATIVA"
      ? "Ativa"
      : machineData.condition === "MANUTENCAO"
      ? "Manutenção"
      : "Inativa";

  return (
    <LayoutDesktop>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Cabeçalho da página */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {machineData.name}
            </h1>
            <p className="text-sm text-gray-500">
              Patrimônio: #{machineData.patrimony}
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            <Link href="/maquinas">
              <Button variant="secondary">
                Voltar
              </Button>
            </Link>
            <Link href={`/maquinas/${params.id}/editar`}>
              <Button variant="warning">
                Editar
              </Button>
            </Link>
            <Button variant="danger">
              Excluir
            </Button>
          </div>
        </div>

        {/* Card com os detalhes da máquina */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Informações Gerais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Status / Condição
              </span>
              <div className="mt-1">
                <LabelWithCircle status={status} text={statusText} />
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Localização
              </span>
              <p className="mt-1 text-base font-medium text-gray-900">
                {machineData.place}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Tag / Categoria
              </span>
              <p className="mt-1 text-base font-medium text-gray-900">
                {machineData.tag || "-"}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Data de Cadastro
              </span>
              <p className="mt-1 text-base font-medium text-gray-900">
                {machineData.createdAt}
              </p>
            </div>
          </div>

          {/* Seção para Descrição */}
          {machineData.description && (
            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                Descrição
              </span>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {machineData.description}
              </p>
            </div>
          )}
        </div>

      </div>
    </LayoutDesktop>
  );
}