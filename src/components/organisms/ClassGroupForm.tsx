"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Save, Search } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import type { ClassGroup, CreateClassGroup, Student, Teacher } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { studentService } from "@/services/studentService";
import { teacherService } from "@/services/teacherService";

const classGroupSchema = v.object({
  acronym: v.pipe(v.string(), v.trim(), v.minLength(2, "Informe a sigla da turma.")),
});

interface MemberSelectorProps {
  label: string;
  emptyMessage: string;
  members: Array<Student | Teacher>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

function MemberSelector({
  label,
  emptyMessage,
  members,
  selectedIds,
  onChange,
}: MemberSelectorProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const filteredMembers = members.filter((member) => {
    if (!normalizedQuery) return true;

    return [member.name, member.numberCard]
      .some((value) => value.toLocaleLowerCase("pt-BR").includes(normalizedQuery));
  });

  function toggleMember(id: string) {
    onChange(
      selectedIdSet.has(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-800">{label}</h3>
          <p className="text-sm text-gray-500">
            {selectedIds.length} selecionado{selectedIds.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          id={`search-${label.toLocaleLowerCase("pt-BR")}`}
          aria-label={`Pesquisar ${label.toLocaleLowerCase("pt-BR")}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquise por nome ou número de crachá"
          className="pl-10"
        />
      </div>

      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {filteredMembers.length ? (
          filteredMembers.map((member) => {
            const selected = selectedIdSet.has(member.id);

            return (
              <label
                key={member.id}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 transition-colors ${
                  selected
                    ? "border-weg-blue bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-gray-800">{member.name}</span>
                  <span className="text-sm text-gray-500">Crachá: {member.numberCard}</span>
                </span>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleMember(member.id)}
                  className="h-4 w-4 accent-weg-blue"
                />
              </label>
            );
          })
        ) : (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
}

interface ClassGroupFormProps {
  initialValues?: ClassGroup;
  cancelHref: string;
  submitLabel: string;
  successMessage: string;
  onSubmit: (payload: CreateClassGroup) => Promise<void>;
}

export default function ClassGroupForm({
  initialValues,
  cancelHref,
  submitLabel,
  successMessage,
  onSubmit,
}: ClassGroupFormProps) {
  const [acronym, setAcronym] = useState(initialValues?.acronym ?? "");
  const [teacherIds, setTeacherIds] = useState(() => initialValues?.teachers.map((teacher) => teacher.id) ?? []);
  const [studentIds, setStudentIds] = useState(() => initialValues?.students.map((student) => student.id) ?? []);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        const [loadedTeachers, loadedStudents] = await Promise.all([
          teacherService.list(),
          studentService.list({ size: 1000, sort: "name,asc" }),
        ]);
        setTeachers(loadedTeachers);
        setStudents(loadedStudents.content);
      } catch (error) {
        toast.error(getServiceErrorMessage(error, "Não foi possível carregar alunos e professores."));
      } finally {
        setLoadingMembers(false);
      }
    }

    void loadMembers();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = v.safeParse(classGroupSchema, { acronym });
    if (!result.success) {
      toast.error(result.issues[0]?.message ?? "Revise os dados da turma.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        acronym: result.output.acronym,
        teacherIds,
        studentIds,
      });
      toast.success(successMessage);
    } catch (error) {
      toast.error(getServiceErrorMessage(error, "Não foi possível salvar a turma."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">Dados da turma</h2>
        <p className="mt-2 text-sm text-gray-500">Pesquise e selecione os alunos e professores que pertencem à turma.</p>
      </div>

      <Input
        id="acronym"
        label="Sigla da turma *"
        value={acronym}
        onChange={(event) => setAcronym(event.target.value)}
        placeholder="Ex.: MEC-2026"
        required
      />

      {loadingMembers ? (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">Carregando alunos e professores...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <MemberSelector
            label="Professores"
            emptyMessage="Nenhum professor encontrado para esta pesquisa."
            members={teachers}
            selectedIds={teacherIds}
            onChange={setTeacherIds}
          />
          <MemberSelector
            label="Alunos"
            emptyMessage="Nenhum aluno encontrado para esta pesquisa."
            members={students}
            selectedIds={studentIds}
            onChange={setStudentIds}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <Link href={cancelHref}><Button type="button" variant="secondary">Cancelar</Button></Link>
        <Button type="submit" icon={Save} disabled={saving || loadingMembers}>
          {saving ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
