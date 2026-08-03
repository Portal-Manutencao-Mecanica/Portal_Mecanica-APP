"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { toast } from "sonner";

import { AutonomousMaintenanceStatusBadge } from "@/components/atoms/AutonomousMaintenanceStatusBadge";
import Button from "@/components/atoms/Button";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import type {
  AutonomousMaintenance,
  AutonomousMaintenanceStatus,
} from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { autonomousMaintenanceService } from "@/services/autonomousMaintenanceService";
import { getServiceErrorMessage } from "@/services/httpService";

type StatusFilter = AutonomousMaintenanceStatus | "TODAS";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function AutonomousMaintenancePage() {
  const { user } = useAuth();
  const [maintenances, setMaintenances] = useState<AutonomousMaintenance[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODAS");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMaintenances() {
      setIsLoading(true);
      try {
        const page = await autonomousMaintenanceService.list({
          status: statusFilter === "TODAS" ? undefined : statusFilter,
        });
        setMaintenances(page.content);
      } catch (error) {
        toast.error(
          getServiceErrorMessage(
            error,
            "Não foi possível carregar as manutenções autônomas.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadMaintenances();
  }, [statusFilter]);

  const columns = useMemo<ColumnProps<AutonomousMaintenance>[]>(
    () => [
      { header: "Máquina", accessorKey: "inspectedMachineName" },
      {
        header: "Agendamento",
        render: (maintenance) =>
          dateFormatter.format(new Date(maintenance.scheduledFor)),
      },
      {
        header: "Alunos",
        render: (maintenance) =>
          maintenance.students.map((student) => student.name).join(", "),
      },
      {
        header: "Condição",
        render: (maintenance) =>
          maintenance.equipmentCondition === "CONFORME"
            ? "Conforme"
            : "Não conforme",
      },
      {
        header: "Situação",
        render: (maintenance) => (
          <AutonomousMaintenanceStatusBadge status={maintenance.status} />
        ),
      },
      {
        header: "Ações",
        align: "right",
        render: (maintenance) => (
          <Button
            href={`/manutencao-autonoma/${maintenance.id}`}
            variant="secondary"
            icon={Eye}
            iconOnly
            aria-label={user?.role === "COORDENADOR" && maintenance.status === "PENDENTE_APROVACAO_COORDENADOR" ? "Analisar manutenção autônoma" : "Visualizar manutenção autônoma"}
            title={user?.role === "COORDENADOR" && maintenance.status === "PENDENTE_APROVACAO_COORDENADOR" ? "Analisar manutenção autônoma" : "Visualizar manutenção autônoma"}
          />
        ),
      },
    ],
    [user?.role],
  );

  const description =
    user?.role === "COORDENADOR"
      ? "Analise e decida as solicitações enviadas pelos professores."
      : user?.role === "ALUNO"
        ? "Consulte as atividades aprovadas atribuídas a você."
        : "Planeje e acompanhe as atividades atribuídas aos alunos.";

  return (
    <LayoutDesktop>
      <div className="space-y-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manutenção autônoma</h1>
            <p className="mt-1 text-gray-500">{description}</p>
          </div>
          {user?.role === "PROFESSOR" && (
            <Link href="/manutencao-autonoma/nova">
              <Button icon={Plus}>Nova manutenção</Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            Carregando manutenções autônomas...
          </div>
        ) : (
          <DataTable
            data={maintenances}
            columns={columns}
            searchKeys={["inspectedMachineName", "responsibleTeacherName"]}
            searchPlaceholder="Buscar por máquina ou professor"
            emptyMessage="Nenhuma manutenção autônoma encontrada."
            filterElement={
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                Status
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="TODAS">Todas</option>
                  <option value="PENDENTE_APROVACAO_COORDENADOR">Pendentes</option>
                  <option value="APROVADA_PELO_COORDENADOR">Aprovadas</option>
                  <option value="REPROVADA_PELO_COORDENADOR">Reprovadas</option>
                </select>
              </label>
            }
          />
        )}
      </div>
    </LayoutDesktop>
  );
}
