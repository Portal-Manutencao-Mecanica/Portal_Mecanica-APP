interface Props {
  condition: string;
}

export default function MachineConditionBadge({ condition }: Props) {
  const styles = {
    ATIVA: "bg-green-100 text-green-700",
    MANUTENCAO: "bg-yellow-100 text-yellow-700",
    INATIVA: "bg-red-100 text-red-700",
  };

  const labels = {
    ATIVA: "Ativa",
    MANUTENCAO: "Manutenção",
    INATIVA: "Inativa",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
        styles[condition as keyof typeof styles]
      }`}
    >
      {labels[condition as keyof typeof labels] ?? condition}
    </span>
  );
}