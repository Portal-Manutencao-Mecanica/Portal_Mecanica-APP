import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";

import type { HelperMaterial, HelperMaterialType } from "@/lib/api/types";

const materialTypeLabels: Record<HelperMaterialType, string> = {
  TECNICO: "Técnico",
  LUBRIFICACAO: "Lubrificação",
  MANUTENCAO_PREVENTIVA: "Manutenção preventiva",
  MANUAL: "Manual",
};

export default function MaterialCard({ material }: { material: HelperMaterial }) {
  return (
    <Link
      href={`/maquinas/material-complementar/${material.id}`}
      className="group flex h-full flex-col rounded-xl border border-gray-200 bg-weg-card-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weg-blue focus-visible:ring-offset-2"
      aria-label={`Visualizar material ${material.title}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-weg-blue/10 text-weg-blue">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {materialTypeLabels[material.type]}
        </span>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-weg-blue">
        {material.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm text-gray-500">
        {material.description || "Material de apoio disponível para consulta."}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-weg-blue">
        Ver detalhes <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

export { materialTypeLabels };
