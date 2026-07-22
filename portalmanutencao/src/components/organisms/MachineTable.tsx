import { MachineRow } from "../molecules/MachineRow";

interface Machine {
  id: number;
  patrimony: string;
  name: string;
  place: string;
  condition: string;
  tag?: string;
}

interface Props {
  machines: Machine[];
}

export function MachineTable({ machines }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      <div className="grid grid-cols-6 bg-gray-100 font-semibold px-6 py-4">

        <span>Patrimônio</span>
        <span>Nome</span>
        <span>Local</span>
        <span>Condição</span>
        <span>Tag</span>
        <span className="text-right">Ações</span>

      </div>

      {machines.map(machine => (
        <MachineRow
          key={machine.id}
          {...machine}
        />
      ))}

    </div>
  );
}