"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    router.push("/ocorrencias");
  }

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
            <select
              name="place"
              value={form.place}
              onChange={handleChange}
              className="rounded-lg border p-3"
            >
              <option value="">Selecione o Local</option>
              <option>Laboratório Mecânica</option>
              <option>Laboratório Elétrica</option>
              <option>Oficina</option>
            </select>

            <select
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              className="rounded-lg border p-3"
            >
              <option value="">Professor Notificado</option>
              <option>Carlos Henrique</option>
              <option>João Pedro</option>
            </select>

            <select
              name="classGroup"
              value={form.classGroup}
              onChange={handleChange}
              className="rounded-lg border p-3"
            >
              <option value="">Turma</option>
              <option>TIIN 2025/1</option>
              <option>TIIN 2025/2</option>
            </select>

            <select
              name="registrationPeriod"
              value={form.registrationPeriod}
              onChange={handleChange}
              className="rounded-lg border p-3"
            >
              <option value="">Período</option>
              <option>Matutino</option>
              <option>Vespertino</option>
              <option>Noturno</option>
            </select>
          </div>

          <Input
            name="students"
            placeholder="Alunos envolvidos"
            value={form.students}
            onChange={handleChange}
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Descrição da ocorrência..."
            className="w-full rounded-lg border p-3"
          />

          <div>
            <label className="mb-2 block font-medium">Imagens</label>

            <input
              type="file"
              multiple
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

            <Button type="submit">Cadastrar Ocorrência</Button>
          </div>
        </form>
      </div>
    </LayoutDesktop>
  );
}
