"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const UUID_SEGMENT_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface BreadcrumbsProps {
  labels?: Record<number, string>;
}

export function Breadcrumbs({ labels = {} }: BreadcrumbsProps) {
  const pathname = usePathname();
  const [dynamicLabels, setDynamicLabels] = useState<Record<number, string>>({});
  const pathSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const labels: Record<number, string> = {};

      if (pathSegments[0] === "turmas") {
        const classGroupName = searchParams.get("turma");
        const studentName = searchParams.get("aluno");

        if (classGroupName && pathSegments[1]) labels[1] = `Turma ${classGroupName}`;
        if (studentName && pathSegments[2] && pathSegments[2] !== "editar") labels[2] = studentName;
      }

      setDynamicLabels(labels);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathSegments]);

  if (pathSegments.length === 0) return null;

  function formatPathName(segment: string, index: number) {
    if (labels[index]) return labels[index];
    if (dynamicLabels[index]) return dynamicLabels[index];

    const contextualDictionary: Record<string, Record<string, string>> = {
      alunos: { editar: "Editar aluno" },
      compras: { cadastro: "Nova compra" },
      equipamentos: { novo: "Novo equipamento", editar: "Editar equipamento" },
      organizacoes: { nova: "Nova organização", editar: "Editar organização" },
      incoveniencia5s: { nova: "Nova ocorrência 5S" },
      manutencao: { cadastro: "Nova manutenção" },
      "manutencao-autonoma": { nova: "Nova manutenção autônoma" },
      maquinas: { criar: "Nova máquina", editar: "Editar máquina" },
      ocorrencias: { cadastro: "Nova ocorrência", editar: "Editar ocorrência" },
      turmas: { criar: "Nova turma", editar: "Editar turma" },
      usuarios: { novo: "Novo usuário", editar: "Editar usuário" },
    };
    const contextualLabel = contextualDictionary[pathSegments[0]]?.[segment];

    if (contextualLabel) return contextualLabel;

    const dictionary: Record<string, string> = {
      usuarios: "Usuários",
      organizacoes: "Organizações",
      maquinas: "Máquinas",
      ocorrencias: "Ocorrências",
      incoveniencia5s: "Inconveniências 5S",
      compras: "Compras",
      equipamentos: "Equipamentos",
      notificacoes: "Notificações",
      alunos: "Alunos",
      turmas: "Turmas",
      calendario: "Calendário",
      configuracao: "Configuração",
      manutencao: "Manutenção",
      "manutencao-autonoma": "Manutenção autônoma",
      "material-complementar": "Material de apoio",
      faq: "Perguntas frequentes",
      perfil: "Perfil",
      termos: "Termos de uso",
    };

    if (dictionary[segment]) return dictionary[segment];
    if (UUID_SEGMENT_PATTERN.test(segment)) return "Detalhes";

    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-gray-500 select-none">
      <Link href="/" className="flex items-center gap-1 no-underline transition-colors hover:text-weg-blue hover:underline" aria-label="Página inicial">
        <Home className="h-4 w-4" />
        <p>Página inicial</p>
      </Link>

      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <div key={href} className="flex items-center">
            <ChevronRight className="mx-2 h-4 w-4 shrink-0 text-gray-400" />
            {isLast ? (
              <span className="font-semibold text-weg-blue" aria-current="page">
                {formatPathName(segment, index)}
              </span>
            ) : (
              <Link href={href} className="no-underline transition-colors hover:text-weg-blue hover:underline">
                {formatPathName(segment, index)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
