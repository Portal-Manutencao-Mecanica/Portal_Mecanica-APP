import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { DataRowCard } from "@/components/molecules/DataRowCard";

export default function Home() {
  return (
    <LayoutDesktop>
      <DataRowCard
        actions={
          <>
            <button>Editar</button>
            <button>Excluir</button>
          </>
        }
      >
        <span>João Silva</span>
        <span>Administrador</span>
        <span>Ativo</span>
      </DataRowCard>
    </LayoutDesktop>
  );
}