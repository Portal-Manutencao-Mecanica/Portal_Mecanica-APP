"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileQuestion,
  Home,
  RotateCcw,
  ServerCrash,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

import Button from "@/components/atoms/Button";

type StatusPageKind = "not-found" | "forbidden" | "unavailable" | "error";

interface StatusPageProps {
  kind: StatusPageKind;
  code: string;
  title: string;
  description: string;
  retry?: boolean;
}

const icons: Record<StatusPageKind, LucideIcon> = {
  "not-found": FileQuestion,
  forbidden: ShieldAlert,
  unavailable: ServerCrash,
  error: ServerCrash,
};

const colors: Record<StatusPageKind, string> = {
  "not-found": "bg-blue-50 text-weg-blue",
  forbidden: "bg-amber-50 text-amber-700",
  unavailable: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-weg-negative",
};

function safeReturnTo(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : null;
}

export default function StatusPage({
  kind,
  code,
  title,
  description,
  retry = false,
}: StatusPageProps) {
  const router = useRouter();
  const Icon = icons[kind];

  function retryRequest() {
    const returnTo = new URLSearchParams(window.location.search).get("returnTo");
    window.location.assign(safeReturnTo(returnTo) ?? window.location.href);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <section className="w-full max-w-md rounded-xl bg-weg-card-white p-8 text-center shadow-sm">
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${colors[kind]}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-semibold text-weg-blue">Erro {code}</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button variant="secondary" icon={ArrowLeft} onClick={() => router.back()}>
            Voltar
          </Button>
          {retry && (
            <Button icon={RotateCcw} onClick={retryRequest}>
              Tentar novamente
            </Button>
          )}
          <Button variant={retry ? "secondary" : "primary"} icon={Home} href="/">
            Ir para o início
          </Button>
        </div>
      </section>
    </main>
  );
}
