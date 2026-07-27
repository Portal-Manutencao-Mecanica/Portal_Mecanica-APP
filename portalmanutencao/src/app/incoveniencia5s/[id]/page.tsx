"use client";

import { useState } from "react";
import Image from "next/image";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import { LabelStatus } from "@/props/LabelProps";

function getStatus(status: string): {
  text: string;
  status: LabelStatus;
} {
  switch (status) {
    case "NAO_VISUALIZADA":
      return {
        text: "Não Visualizada",
        status: "warning",
      };

    case "VISUALIZADA":
      return {
        text: "Visualizada",
        status: "default",
      };

    case "RESOLVIDA":
      return {
        text: "Resolvida",
        status: "positive",
      };

    default:
      return {
        text: status,
        status: "default",
      };
  }
}

export default function InconvenienceDetailsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const inconvenience = {
    id: "1",
    numberCard: "5S-0001",
    inconvenience: "Cabos espalhados pelo laboratório",
    status: "VISUALIZADA",
    place: "Laboratório Mecânica",
    notifiedTeacher: "Carlos Henrique",
    classGroup: "TIIN 2025/1",
    createdBy: "João Silva",
    registrationPeriod: "Noturno",
    createdAt: "27/07/2026",

    involvedStudents: [
      "Junior Gabriel",
      "Otávio",
      "Ícaro",
    ],

    description:
      "Durante a aula prática foram encontrados diversos cabos espalhados pelo laboratório, oferecendo risco de tropeço e dificultando a organização do ambiente.",

    media: [
      "/images/default-equipment.png",
      "/images/default-equipment.png",
    ],
  };

  const label = getStatus(inconvenience.status);

  function handleResolve() {
    console.log("Ocorrência resolvida.");
    setDialogOpen(false);
  }

  return (
    <LayoutDesktop>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {inconvenience.numberCard}
            </h1>

            <p className="text-gray-500">
              Detalhes da ocorrência 5S.
            </p>
          </div>

          <LabelWithCircle
            status={label.status}
            text={label.text}
          />
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Inconveniência</p>
              <p className="text-lg font-semibold">
                {inconvenience.inconvenience}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Local</p>
              <p className="text-lg">{inconvenience.place}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Professor Notificado
              </p>
              <p className="text-lg">
                {inconvenience.notifiedTeacher}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Turma</p>
              <p className="text-lg">
                {inconvenience.classGroup}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Criado por</p>
              <p className="text-lg">
                {inconvenience.createdBy}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Período</p>
              <p className="text-lg">
                {inconvenience.registrationPeriod}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Data da Ocorrência
              </p>
              <p className="text-lg">
                {inconvenience.createdAt}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-2 text-sm text-gray-500">
              Alunos Envolvidos
            </p>

            <div className="flex flex-wrap gap-2">
              {inconvenience.involvedStudents.map((student) => (
                <span
                  key={student}
                  className="rounded-full bg-blue-100 px-4 py-2 text-sm"
                >
                  {student}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-2 text-sm text-gray-500">
              Descrição
            </p>

            <div className="rounded-lg bg-gray-50 p-4">
              {inconvenience.description}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-4 text-sm text-gray-500">
              Imagens
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {inconvenience.media.map((image, index) => (
                <div
                  key={index}
                  className="relative h-40 rounded-lg border"
                >
                  <Image
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {inconvenience.status !== "RESOLVIDA" && (
          <div className="flex justify-end">
            <Button
              onClick={() => setDialogOpen(true)}
            >
              Marcar como Resolvida
            </Button>
          </div>
        )}

        <ConfirmDialog
          open={dialogOpen}
          title="Resolver Ocorrência"
          description="Deseja marcar esta ocorrência 5S como resolvida?"
          confirmText="Resolver"
          confirmVariant="primary"
          onCancel={() => setDialogOpen(false)}
          onConfirm={handleResolve}
        />
      </div>
    </LayoutDesktop>
  );
}