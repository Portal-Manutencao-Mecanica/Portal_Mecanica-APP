"use client";

import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import UploadedCsv from "@/components/molecules/UploadedCsv";
import { useAuth } from "@/hooks/useAuth";
import type { ClassGroup, UserImportResponse } from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
import { userService } from "@/services/userService";

interface UserCsvImportProps {
  onImportCompleted: () => void;
}

const templateHeaders = [
  "name",
  "email",
  "role",
  "organization",
  "classGroupAcronyms",
] as const;

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

function detectDelimiter(content: string) {
  let quoted = false;
  const counts = new Map([[",", 0], [";", 0], ["\t", 0]]);

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (!quoted && (character === "\n" || character === "\r")) {
      break;
    } else if (!quoted && counts.has(character)) {
      counts.set(character, (counts.get(character) ?? 0) + 1);
    }
  }

  return [...counts.entries()].reduce(
    (current, candidate) => candidate[1] > current[1] ? candidate : current,
    [",", 0] as [string, number],
  )[0];
}

function parseCsv(content: string) {
  const delimiter = detectDelimiter(content);
  const records: string[][] = [];
  let record: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      record.push(value.trim());
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      record.push(value.trim());
      if (record.some(Boolean)) records.push(record);
      record = [];
      value = "";
    } else {
      value += character;
    }
  }

  record.push(value.trim());
  if (record.some(Boolean)) records.push(record);
  return records;
}

function escapeCsv(value: string) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

async function createImportFile(file: File) {
  const records = parseCsv(await file.text());
  const [header, ...rows] = records;
  const normalizedHeader = header?.map((column) => column.replace(/^\uFEFF/, "").trim());

  if (!normalizedHeader || !templateHeaders.every((column) => normalizedHeader.includes(column))) {
    throw new Error(
      "Use o modelo CSV com as colunas: name, email, role, organization e classGroupAcronyms.",
    );
  }

  const classGroupNamesIndex = normalizedHeader.indexOf("classGroupAcronyms");
  const classGroupsPage = await classGroupBrowserService.list(1000);
  const groupsByName = new Map<string, ClassGroup[]>();

  for (const classGroup of classGroupsPage.content) {
    const name = normalizeName(classGroup.acronym);
    groupsByName.set(name, [...(groupsByName.get(name) ?? []), classGroup]);
  }

  const convertedRows = rows.map((row, index) => {
    const groupNames = (row[classGroupNamesIndex] ?? "")
      .split("|")
      .map((name) => name.trim())
      .filter(Boolean);
    const classGroupIds = groupNames.map((groupName) => {
      const matches = groupsByName.get(normalizeName(groupName)) ?? [];
      if (matches.length === 0) {
        throw new Error(`Linha ${index + 2}: a turma \"${groupName}\" não foi encontrada.`);
      }
      if (matches.length > 1) {
        throw new Error(`Linha ${index + 2}: a turma \"${groupName}\" está duplicada.`);
      }
      return matches[0].id;
    });

    return templateHeaders.map((column) => {
      if (column === "classGroupAcronyms") return classGroupIds.join("|");
      return row[normalizedHeader.indexOf(column)] ?? "";
    });
  });

  const backendHeader = [
    "name",
    "email",
    "role",
    "organization",
    "classGroupIds",
  ];
  const content = [backendHeader, ...convertedRows]
    .map((record) => record.map(escapeCsv).join(","))
    .join("\n");

  return new File([content], file.name, { type: "text/csv" });
}

export default function UserCsvImport({
  onImportCompleted,
}: UserCsvImportProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<UserImportResponse | null>(null);

  if (!user || (user.role !== "ADMIN" && user.role !== "COORDENADOR")) return null;

  const actorRole = user.role;
  const allowedRoles = actorRole === "ADMIN"
    ? "ALUNO, PROFESSOR, COORDENADOR ou ADMIN"
    : "ALUNO ou PROFESSOR";

  function downloadTemplate() {
    const organization = "SENAI";
    const content = [
      templateHeaders.join(","),
      `Nome do usuário,usuario@empresa.com,ALUNO,${organization},MEC-2026`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "modelo-importacao-usuarios.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importFile() {
    if (!file) {
      toast.error("Selecione o arquivo CSV antes de importar.");
      return;
    }

    setImporting(true);
    try {
      const importFile = await createImportFile(file);
      const importResult = await userService.importCsv(importFile);
      setResult(importResult);
      if (importResult.created > 0) onImportCompleted();
      toast.success(`${importResult.created} usuário(s) importado(s).`);
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível importar o arquivo."));
    } finally {
      setImporting(false);
    }
  }

  return (
    <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-800">Importar usuários por CSV</h2>
          <p className="text-sm text-gray-500">
            Use somente as siglas das turmas, separadas por <code>|</code>. Nenhum UUID precisa ser informado.
          </p>
          <p className="text-sm text-gray-500">
            O username e gerado automaticamente pelo nome completo e uma sequencia numerica.
          </p>
          <p className="text-sm text-gray-500">Roles permitidas: {allowedRoles}.</p>
        </div>
        <Button variant="secondary" icon={Download} onClick={downloadTemplate}>
          Baixar modelo CSV
        </Button>
      </div>

      <UploadedCsv onChange={setFile} disabled={importing} />

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button disabled={!file || importing} icon={Upload} onClick={importFile}>
          {importing ? "Importando..." : "Importar usuários"}
        </Button>
      </div>

      {result && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm" aria-live="polite">
          <p className="font-medium text-gray-800">
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
