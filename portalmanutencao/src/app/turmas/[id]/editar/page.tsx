"use client";

import { FormEvent, use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import Button from "@/components/atoms/Button";
import LayoutDesktop from "@/components/templates/LayoutDesktop";

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface ClassGroup {
  id: number;
  acronym: string;
  teachers: Teacher[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditClassPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [acronym, setAcronym] = useState("");
  const [teachers, setTeachers] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClass() {
      try {
        const response = await fetch(`http://localhost:8080/api/turma/${id}`);

        if (!response.ok) {
          throw new Error("Não foi possível carregar os dados da turma.");
        }

        const classGroup: ClassGroup = await response.json();
        setAcronym(classGroup.acronym ?? "");
        setTeachers(classGroup.teachers?.map((teacher) => teacher.name).join(", ") ?? "");
      } catch (loadError) {
        console.error(loadError);
        setError("Não foi possível carregar os dados da turma. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    loadClass();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:8080/api/turma/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acronym: acronym.trim(),
          teachers: teachers
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar a turma.");
      }

      router.push(`/turmas/${id}`);
      router.refresh();
    } catch (saveError) {
      console.error(saveError);
      setError("Não foi possível salvar as alterações. Verifique a API e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
        <div className="flex items-center gap-3">
          <Link href={`/turmas/${id}`} aria-label="Voltar para a turma">
            <Button type="button" variant="secondary" icon={ArrowLeft}>
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Editar turma</h1>
            <p className="mt-1 text-sm text-gray-500">Atualize as informações da turma e salve as alterações.</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Carregando dados da turma...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">Dados da turma</h2>
              <p className="mt-2 text-sm text-gray-500">Os campos marcados com * são obrigatórios.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="acronym" className="mb-1 block text-sm font-medium text-gray-700">
                  Sigla da turma *
                </label>
                <input
                  id="acronym"
                  name="acronym"
                  value={acronym}
                  onChange={(event) => setAcronym(event.target.value)}
                  placeholder="Ex.: MEC-2026"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-weg-blue"
                />
              </div>

              <div>
                <label htmlFor="teachers" className="mb-1 block text-sm font-medium text-gray-700">
                  Professores
                </label>
                <input
                  id="teachers"
                  name="teachers"
                  value={teachers}
                  onChange={(event) => setTeachers(event.target.value)}
                  placeholder="Separe os nomes por vírgula"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-weg-blue"
                />
                <p className="mt-1 text-xs text-gray-500">Ex.: Ana Souza, Carlos Lima</p>
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <Link href={`/turmas/${id}`}>
                <Button type="button" variant="secondary">Cancelar</Button>
              </Link>
              <Button type="submit" variant="primary" icon={Save} disabled={saving}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </LayoutDesktop>
  );
}
