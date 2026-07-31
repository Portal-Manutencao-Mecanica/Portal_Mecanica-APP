"use client";

import { ChangeEvent, useState } from "react";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import { useAuth } from "@/hooks/useAuth";
import type { UserImportResponse } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { userService } from "@/services/userService";

interface UserCsvImportProps {
  onImportCompleted: () => void;
}

export default function UserCsvImport({
  onImportCompleted,
}: UserCsvImportProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<UserImportResponse | null>(null);

  const actor = user;
  const canImport = actor?.role === "ADMIN" || actor?.role === "COORDENADOR";
  const allowedRoles = actor?.role === "ADMIN"
    ? "ALUNO, PROFESSOR, COORDENADOR ou ADMIN"
    : "ALUNO ou PROFESSOR";

  if (!canImport || !actor) return null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    if (selectedFile && !/\.(csv|xlsx)$/i.test(selectedFile.name)) {
      toast.error("Selecione um arquivo no formato CSV ou XLSX.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setResult(null);
  }

  function downloadTemplate() {
    const organization = actor.role === "COORDENADOR" ? "" : "SENAI";
    const content = [
      "name,username,email,role,organization,classGroupIds",
      `Nome do usuário,usuario.nome,usuario@empresa.com,ALUNO,${organization},`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "modelo-importacao-usuarios.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importFile() {
    if (!file) {
      toast.error("Selecione o arquivo CSV ou XLSX antes de importar.");
      return;
    }

    setImporting(true);
    try {
      const importResult = await userService.importCsv(file);
      setResult(importResult);
      if (importResult.created > 0) onImportCompleted();
      toast.success(`${importResult.created} usuário(s) importado(s).`);
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível importar o arquivo."),
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="text-lg font-semibold">Importar usuários por arquivo</h2>
          <p className="mt-1 text-sm text-gray-500">
            Cabeçalho: <code>name, username, email, role, organization, classGroupIds</code>.
            A coluna <code>organization</code> aceita somente <code>SENAI</code>, <code>WEG</code> ou <code>OTHER</code>;
            para COORDENADOR ela pode ficar vazia e a organização própria é usada.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Roles permitidas para você: {allowedRoles}.
          </p>
        </div>
        <Button variant="secondary" icon={Download} onClick={downloadTemplate}>
          Baixar modelo CSV
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          aria-label="Arquivo CSV de usuários"
          accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700"
          onChange={handleFileChange}
          type="file"
        />
        <Button disabled={!file || importing} icon={Upload} onClick={importFile}>
          {importing ? "Importando..." : "Importar arquivo"}
        </Button>
      </div>

      {result && (
        <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm">
          <p className="font-medium">
            Resultado: {result.created} criado(s), {result.failed} com falha.
          </p>
          {result.failed > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-red-700">
              {result.items
                .filter((item) => item.status === "FAILED")
                .slice(0, 10)
                .map((item) => (
                  <li key={item.id}>
                    Linha {item.row}: {item.message ?? "Não foi possível importar."}
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
