"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import UploadedFile64 from "@/components/molecules/UploadedFile64";
import DropDown from "@/components/atoms/DropDown";

export default function NewInconveniencePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    inconvenience: "",
    place: "",
    teacher: "",
    classGroup: "",
    registrationPeriod: "",
    students: "",
    description: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const handleSelectChange = (fieldName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    router.push("/ocorrencias");
  }
  const Places = {
    MECANICA: "Laboratório Mecânica",
    ELETRICA: "Laboratório Elétrica",
    OFICINA: "Oficina",
  } as const;

  const Teachers = {
    CARLOS: "Carlos Henrique",
    JOAO: "João Pedro",
  } as const;

  const ClassGroups = {
    TURMA_2025_1: "TIIN 2025/1",
    TURMA_2025_2: "TIIN 2025/2",
  } as const;

  const RegistrationPeriods = {
    MATUTINO: "Matutino",
    VESPERTINO: "Vespertino",
    NOTURNO: "Noturno",
  } as const;

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-3xl font-bold">Nova Ocorrência 5S</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="inconvenience"
            placeholder="Inconveniência"
            value={form.inconvenience}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DropDown
              defaultSelection="Selecione o Local"
              enumData={Places}
              onSelect={(value) => handleSelectChange("place", value)}
            />

            <DropDown
              defaultSelection="Professor Notificado"
              enumData={Teachers}
              onSelect={(value) => handleSelectChange("teacher", value)}
            />

            <DropDown
              defaultSelection="Turma"
              enumData={ClassGroups}
              onSelect={(value) => handleSelectChange("classGroup", value)}
            />

            <DropDown
              defaultSelection="Período"
              enumData={RegistrationPeriods}
              onSelect={(value) => handleSelectChange("registrationPeriod", value)}
            />
          </div>

          <Input
            name="students"
            placeholder="Alunos envolvidos"
            value={form.students}
            onChange={handleChange}
          />

          <TextArea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Descrição da ocorrência..."
            className="w-full rounded-lg border p-3" label={"Descrição"} />

          <div>
            <UploadedFile64></UploadedFile64>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>

            <Button type="submit">Cadastrar Ocorrência</Button>
          </div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
