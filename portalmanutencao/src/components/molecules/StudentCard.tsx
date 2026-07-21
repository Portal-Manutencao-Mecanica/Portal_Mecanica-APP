import Button from "../atoms/Button";

interface StudentCardProps {
  registration: string;
  name: string;
}

export function StudentCard({ registration, name }: StudentCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="font-semibold text-lg">{name}</p>
        <p className="text-gray-500">Matrícula: {registration}</p>
      </div>

      <Button>Ver perfil</Button>
    </div>
  );
}
