"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import Button from "@/components/atoms/Button";
import DropDown from "@/components/atoms/DropDown";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import PageHeader from "@/components/molecules/PageHeader";
import { CascadingMultiSelect } from "@/components/molecules/CascadingSelector";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type {
  ClassGroup,
  Place,
  RegistrationPeriod,
  Teacher,
} from "@/lib/api/types";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
import { inconvenienceService } from "@/services/inconvenienceService";
import { placeService } from "@/services/placeService";
import { teacherService } from "@/services/teacherService";

const inconvenienceSchema = v.object({
  inconvenience: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(3, "Descreva a inconveniência."),
  ),
  placeId: v.pipe(v.string(), v.uuid("Selecione um local válido.")),
  notifiedTeacherId: v.pipe(
    v.string(),
    v.uuid("Selecione um professor válido."),
  ),
  classGroupId: v.pipe(v.string(), v.uuid("Selecione uma turma válida.")),
  registrationPeriod: v.picklist(
    ["MATUTINO", "VESPERTINO", "NOTURNO"],
    "Selecione o período.",
  ),
  involvedStudentIds: v.pipe(
    v.array(v.pipe(v.string(), v.uuid("Selecione alunos válidos."))),
    v.minLength(1, "Selecione ao menos um aluno."),
  ),
  description: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, "Descreva a ocorrência com mais detalhes."),
  ),
});

interface FormState {
  inconvenience: string;
  placeId: string;
  notifiedTeacherId: string;
  classGroupId: string;
  registrationPeriod: RegistrationPeriod | "";
  involvedStudentIds: string[];
  description: string;
}

const initialForm: FormState = {
  inconvenience: "",
  placeId: "",
  notifiedTeacherId: "",
  classGroupId: "",
  registrationPeriod: "",
  involvedStudentIds: [],
  description: "",
};

const registrationPeriods: Record<RegistrationPeriod, string> = {
  MATUTINO: "Matutino",
  VESPERTINO: "Vespertino",
  NOTURNO: "Noturno",
};

export default function NewInconveniencePage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [loadedPlaces, loadedTeachers, classGroupPage] = await Promise.all([
          placeService.list(),
          teacherService.list(),
          classGroupBrowserService.list(1000),
        ]);
        setPlaces(loadedPlaces);
        setTeachers(
          loadedTeachers.filter((teacher) => teacher.enabled && teacher.accountNonLocked),
        );
        setClassGroups(classGroupPage.content.filter((classGroup) => classGroup.enabled));
      } catch (error) {
        setLoadError(
          getServiceErrorMessage(
            error,
            "Não foi possível carregar locais, professores e turmas.",
          ),
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    void loadOptions();
  }, []);

  const selectedClassGroup = useMemo(
    () => classGroups.find((classGroup) => classGroup.id === form.classGroupId),
    [classGroups, form.classGroupId],
  );
  const studentGroups = useMemo(
    () =>
      selectedClassGroup
        ? [
            {
              id: selectedClassGroup.id,
              name: selectedClassGroup.acronym,
              items: selectedClassGroup.students.map((student) => ({
                id: student.id,
                name: student.name,
              })),
            },
          ]
        : [],
    [selectedClassGroup],
  );

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = v.safeParse(inconvenienceSchema, form);

    if (!validation.success) {
      toast.error(validation.issues[0]?.message ?? "Revise os dados da ocorrência.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await inconvenienceService.create(validation.output);
      toast.success("Ocorrência 5S registrada com sucesso.");
      router.push(`/incoveniencia5s/${created.id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível registrar a ocorrência 5S."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Nova ocorrência 5S"
          description="Registre uma situação que precisa de atenção."
        />

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-weg-card-white p-6 shadow-sm"
        >
          <Input
            name="inconvenience"
            label="Inconveniência *"
            value={form.inconvenience}
            onChange={(event) => updateField("inconvenience", event.target.value)}
            placeholder="Descreva o problema"
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <DropDown
              label="Local *"
              defaultSelection={loadingOptions ? "Carregando locais..." : "Selecione o local"}
              enumData={Object.fromEntries(places.map((place) => [place.id, place.name]))}
              value={form.placeId}
              onSelect={(value) => updateField("placeId", value)}
              disabled={loadingOptions || Boolean(loadError)}
            />
            <DropDown
              label="Professor notificado *"
              defaultSelection={
                loadingOptions ? "Carregando professores..." : "Selecione o professor"
              }
              enumData={Object.fromEntries(
                teachers.map((teacher) => [teacher.id, teacher.name]),
              )}
              value={form.notifiedTeacherId}
              onSelect={(value) => updateField("notifiedTeacherId", value)}
              disabled={loadingOptions || Boolean(loadError)}
            />
            <DropDown
              label="Turma *"
              defaultSelection={loadingOptions ? "Carregando turmas..." : "Selecione a turma"}
              enumData={Object.fromEntries(
                classGroups.map((classGroup) => [classGroup.id, classGroup.acronym]),
              )}
              value={form.classGroupId}
              onSelect={(value) =>
                setForm((current) => ({
                  ...current,
                  classGroupId: value,
                  involvedStudentIds: [],
                }))
              }
              disabled={loadingOptions || Boolean(loadError)}
            />
            <DropDown
              label="Período *"
              defaultSelection="Selecione o período"
              enumData={registrationPeriods}
              value={form.registrationPeriod}
              onSelect={(value) =>
                updateField("registrationPeriod", value as FormState["registrationPeriod"])
              }
            />
          </div>

          <CascadingMultiSelect
            label="Alunos envolvidos *"
            groups={studentGroups}
            value={form.involvedStudentIds}
            onChange={(studentIds) =>
              updateField("involvedStudentIds", studentIds.map(String))
            }
            placeholder={
              form.classGroupId
                ? "Selecione os alunos envolvidos"
                : "Selecione primeiro uma turma"
            }
            groupHeader="Turma selecionada"
            itemHeader="Alunos"
          />

          <TextArea
            name="description"
            label="Descrição *"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={6}
            placeholder="Descreva a ocorrência..."
          />

          {loadError && <p className="text-sm text-weg-negative">{loadError}</p>}

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-4 sm:flex-row">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || loadingOptions || Boolean(loadError)}
            >
              {submitting ? "Registrando..." : "Registrar ocorrência"}
            </Button>
          </div>
        </form>
      </section>
    </LayoutDesktop>
  );
}
