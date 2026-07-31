import { StatCardProps } from "@/props/StatCardProps";

export function StatCard({
  label,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-md flex items-center justify-between select-none">
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      
      {/* Container do Ícone padronizado com as cores da WEG */}
      <div className="p-3 rounded-lg text-weg-blue bg-weg-blue/10 shrink-0">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}