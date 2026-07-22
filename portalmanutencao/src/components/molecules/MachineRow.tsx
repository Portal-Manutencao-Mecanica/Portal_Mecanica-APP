import Link from "next/link";
import Button from "../atoms/Button";
import LabelWithCircle from "../molecules/LabelWithCircle";

interface Props {
  id: number;
  patrimony: string;
  name: string;
  place: string;
  condition: "ATIVA" | "MANUTENCAO" | "INATIVA";
  tag?: string;
}

export function MachineRow({
  id,
  patrimony,
  name,
  place,
  condition,
  tag,
}: Props) {
  const status =
    condition === "ATIVA"
      ? "positive"
      : condition === "MANUTENCAO"
      ? "warning"
      : "negative";
  const text =
    condition === "ATIVA"
      ? "Ativa"
      : condition === "MANUTENCAO"
      ? "Manutenção"
      : "Inativa";

  return (
    <div className="grid grid-cols-6 items-center border-t border-gray-100 px-6 py-5">
      <span>{patrimony}</span>
      <span>{name}</span>
      <span>{place}</span>
      <LabelWithCircle
        status={status}
        text={text}
      />
      <span>{tag ?? "-"}</span>
      <div className="flex justify-end gap-2">
        <Link href={`/maquinas/${id}`}>
          <Button>Ver</Button>
        </Link>
        <Link href={`/maquinas/${id}/editar`}>
          <Button className="bg-amber-400 hover:bg-amber-500 text-black">
            Editar
          </Button>
        </Link>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Excluir
        </Button>
      </div>
    </div>
  );
}