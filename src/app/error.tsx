"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

import Button from "@/components/atoms/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Erro inesperado na aplicacao.", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <section className="w-full max-w-md rounded-xl bg-weg-card-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-weg-negative">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button variant="secondary" icon={Home} href="/">
            Ir para o início
          </Button>
          <Button icon={RotateCcw} onClick={reset}>
            Tentar novamente
          </Button>
        </div>
      </section>
    </main>
  );
}
