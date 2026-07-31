import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActionCardProps } from "@/props/ActionCardProps";

export function ActionCard({ label, href, icon: Icon, desc }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-weg-blue/30 hover:-translate-y-0.5 transition-all duration-200 select-none cursor-pointer"
    >
      <div className="flex items-center gap-3.5">
        {/* Ícone menor com cantos arredondados e cor WEG */}
        <div className="p-3 rounded-lg bg-weg-blue/10 text-weg-blue group-hover:bg-weg-blue group-hover:text-white transition-colors duration-200 shrink-0">
          <Icon className="w-5 h-5" />
        </div>

        {/* Textos juntos sem deixar "espaço morto" */}
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-800 text-sm group-hover:text-weg-blue transition-colors">
            {label}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1">
            {desc}
          </p>
        </div>
      </div>

      {/* Seta discreta no alinhamento vertical central */}
      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-weg-blue group-hover:translate-x-1 transition-all shrink-0 ml-2" />
    </Link>
  );
}