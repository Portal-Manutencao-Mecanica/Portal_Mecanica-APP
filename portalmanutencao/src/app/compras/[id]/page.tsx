"use client";

import { useState } from "react";
import Link from "next/link";

import LayoutDesktop from "@/components/templates/LayoutDesktop";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import { LabelStatus } from "@/types/LabelStatus";

function getStatus(status: string): {
  text: string;
  status: LabelStatus;
} {
  switch (status) {
    case "NAO_VISUALIZADO":
      return {
        text: "Não Visualizado",
        status: "warning",
      };

    case "VISUALIZADO":
      return {
        text: "Visualizado",
        status: "default",
      };

    case "APROVADO":
      return {
        text: "Aprovado",
        status: "positive",
      };

    case "REPROVADO":
      return {
        text: "Reprovado",
        status: "negative",
      };

    default:
      return {
        text: status,
        status: "default",
      };
  }
}

export default function BuyDetailsPage() {
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  const buy = {
    id: "1",
    numberCard: "COMP-0001",
    status: "NAO_VISUALIZADO",
    createdBy: "João Silva",
    classGroup: "TIIN 2025/1",
    createdAt: "24/07/2026",
    purchaseJustification:
      "Necessidade de reposição dos equipamentos utilizados nas aulas práticas.",

    items: [
      {
        id: "1",
        equipment: "Motor WEG 2CV",
        quantity: 2,
        sap: "123456",
        patrimony: "-",
        tag: "TAG-001",
        mechanicalSet: "Conjunto A",
        technicalSpecification:
          "Motor trifásico 220V para utilização em bancada didática.",
      },
      {
        id: "2",
        equipment: "Rolamento SKF",
        quantity: 10,
        sap: "654321",
        patrimony: "-",
        tag: "-",
        mechanicalSet: "-",
        technicalSpecification:
          "Rolamento para manutenção preventiva dos equipamentos.",
      },
    ],
  };

  const label = getStatus(buy.status);

  function handleApprove() {
    console.log("Compra aprovada");
    setApproveDialog(false);
  }

  function handleReject() {
    console.log("Compra reprovada");
    setRejectDialog(false);
  }

  return (
    <LayoutDesktop>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{buy.numberCard}</h1>

            <p className="text-gray-500">Detalhes da solicitação de compra.</p>
          </div>

          <LabelWithCircle status={label.status} text={label.text} />
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Professor</p>

              <p className="text-lg font-semibold">{buy.createdBy}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Turma</p>

              <p className="text-lg">{buy.classGroup}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Data da Solicitação</p>

              <p className="text-lg">{buy.createdAt}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Quantidade de Itens</p>

              <p className="text-lg">{buy.items.length}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-2 text-sm text-gray-500">Justificativa</p>

            <div className="rounded-lg border bg-gray-50 p-4">
              {buy.purchaseJustification}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Itens Solicitados</h2>

          <div className="space-y-6">
            {buy.items.map((item) => (
              <div key={item.id} className="rounded-lg border p-5">
                <h3 className="text-lg font-semibold">{item.equipment}</h3>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <strong>Quantidade:</strong> {item.quantity}
                  </div>

                  <div>
                    <strong>SAP:</strong> {item.sap || "-"}
                  </div>

                  <div>
                    <strong>Patrimônio:</strong> {item.patrimony}
                  </div>

                  <div>
                    <strong>Tag:</strong> {item.tag}
                  </div>

                  <div>
                    <strong>Conjunto Mecânico:</strong> {item.mechanicalSet}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Especificação Técnica</p>

                  <div className="mt-1 rounded-lg bg-gray-50 p-3">
                    {item.technicalSpecification}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(buy.status === "NAO_VISUALIZADO" || buy.status === "VISUALIZADO") && (
          <div className="flex justify-end gap-4">
            <Button variant="danger" onClick={() => setRejectDialog(true)}>
              Reprovar
            </Button>

            <Button onClick={() => setApproveDialog(true)}>Aprovar</Button>
          </div>
        )}

        <ConfirmDialog
          open={approveDialog}
          title="Aprovar Solicitação"
          description="Deseja realmente aprovar esta solicitação de compra?"
          onCancel={() => setApproveDialog(false)}
          onConfirm={handleApprove}
        />

        <ConfirmDialog
          open={rejectDialog}
          title="Reprovar Solicitação"
          description="Deseja realmente reprovar esta solicitação de compra?"
          onCancel={() => setRejectDialog(false)}
          onConfirm={handleReject}
        />
      </div>
    </LayoutDesktop>
  );
}
