interface Props {
  condition: string;
}

export default function MachineConditionBadge({
  condition,
}: Props) {

  const colors = {
    ATIVA: "bg-green-100 text-green-700",
    MANUTENCAO: "bg-yellow-100 text-yellow-700",
    INATIVA: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium w-fit ${
        colors[condition as keyof typeof colors]
      }`}
    >
      {condition}
    </span>
  );
}