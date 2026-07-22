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
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">

      <div className="min-w-[900px]">

        <div className="grid grid-cols-6 bg-gray-100 px-6 py-4 font-semibold">
          <span>Patrimônio</span>
          <span>Nome</span>
          <span>Local</span>
          <span>Condição</span>
          <span>Tag</span>
          <span className="text-right">Ações</span>
        </div>

        {machines.map((machine) => (
          <MachineRow key={machine.id} {...machine} />
        ))}

      </div>

    </div>
  );
}