import { Eye, Pencil } from "lucide-react";
import Button from "../atoms/Button";
import LabelWithCircle from "./LabelWithCircle";

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
        <Button href={`/maquinas/${id}`} variant="secondary" icon={Eye} iconOnly aria-label={`Visualizar máquina ${name}`} title="Visualizar máquina" />
        <Button
          href={`/maquinas/${id}/editar`}
          icon={Pencil}
          iconOnly
          aria-label={`Editar máquina ${name}`}
          title="Editar máquina"
        />
        <Button variant="danger">Excluir</Button>
      </div>
    </div>
  );
}
