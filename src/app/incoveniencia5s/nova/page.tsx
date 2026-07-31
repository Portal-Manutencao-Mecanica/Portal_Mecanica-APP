"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as v from "valibot";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";


const inconvenienceSchema = v.object({
  inconvenience: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(3, "Descreva a inconveniência.")
  ),
  place: v.pipe(v.string(), v.nonEmpty("Selecione o local.")),
  teacher: v.pipe(v.string(), v.nonEmpty("Selecione o professor notificado.")),
  classGroup: v.pipe(v.string(), v.nonEmpty("Selecione a turma.")),
  registrationPeriod: v.pipe(v.string(), v.nonEmpty("Selecione o período.")),
  students: v.pipe(v.string(), v.nonEmpty("Informe os alunos envolvidos.")),
  description: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(10, "Descreva a ocorrência com mais detalhes.")
  ),
});

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
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm({ ...form, [event.target.name]: event.target.value });
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = v.safeParse(inconvenienceSchema, form);
    if (!validation.success) {
      toast.error(
        validation.issues[0]?.message ?? "Revise os dados da ocorrência."
      );
      return;
    }
    toast.info(
      "A ocorrência foi validada. A API de 5S ainda precisa receber os identificadores reais de local, turma e usuários."
    );
  }
  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-4xl rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">Nova ocorrência 5S</h1>
        <p className="mb-8 text-gray-500">
          Registre uma situação que precisa de atenção.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="inconvenience"
            label="Inconveniência *"
            value={form.inconvenience}
            onChange={handleChange}
            placeholder="Descreva o problema"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Select
              name="place"
              label="Local *"
              value={form.place}
              onChange={handleChange}
              options={[
                "Laboratório de Mecânica",
                "Laboratório de Elétrica",
                "Oficina",
              ]}
            />
            <Select
              name="teacher"
              label="Professor notificado *"
              value={form.teacher}
              onChange={handleChange}
              options={["Carlos Henrique", "João Pedro"]}
            />
            <Select
              name="classGroup"
              label="Turma *"
              value={form.classGroup}
              onChange={handleChange}
              options={["TIIN 2025/1", "TIIN 2025/2"]}
            />
            <Select
              name="registrationPeriod"
              label="Período *"
              value={form.registrationPeriod}
              onChange={handleChange}
              options={["Matutino", "Vespertino", "Noturno"]}
            />
          </div>
          <Input
            name="students"
            label="Alunos envolvidos *"
            value={form.students}
            onChange={handleChange}
            placeholder="Informe os alunos envolvidos"
          />
          <div>
            <label className="mb-2 block text-sm font-medium">
              Descrição *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Descreva a ocorrência..."
              className="w-full rounded-lg border p-3"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit">Validar ocorrência</Button>
          </div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
function Select({
  name,
  label,
  value,
  onChange,
  options,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-lg border p-3"
      >
        <option value="">Selecione uma opção</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
