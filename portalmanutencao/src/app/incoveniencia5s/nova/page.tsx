"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import { inconvenienceService } from "@/services/inconvenienceService";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await inconvenienceService.create({
      inconvenience: form.inconvenience,
      placeId: form.place,
      notifiedTeacherId: form.teacher,
      classGroupId: form.classGroup,
      registrationPeriod: form.registrationPeriod,
      involvedStudentIds: form.students.split(",").map((id) => id.trim()).filter(Boolean),
      description: form.description,
    });
    router.push("/incoveniencia5s");
    router.refresh();
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
            <Input name="place" label="ID do local *" required value={form.place} onChange={handleChange} />
            <Input name="teacher" label="ID do professor *" required value={form.teacher} onChange={handleChange} />
            <Input name="classGroup" label="ID da turma *" required value={form.classGroup} onChange={handleChange} />

            <select
              name="registrationPeriod"
              value={form.registrationPeriod}
              onChange={handleChange}
              className="ui-control"
              required
            >
              <option value="">Período</option>
              <option value="MATUTINO">Matutino</option>
              <option value="VESPERTINO">Vespertino</option>
              <option value="NOTURNO">Noturno</option>
            </select>
          </div>

          <Input
            name="students"
            label="IDs dos alunos envolvidos *"
            placeholder="Separe os UUIDs por vírgula"
            required
            value={form.students}
            onChange={handleChange}
          />

          <TextArea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Descrição da ocorrência..."
            label="Descrição"
          />

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
