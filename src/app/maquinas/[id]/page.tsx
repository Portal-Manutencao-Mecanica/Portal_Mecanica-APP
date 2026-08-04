"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardPlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import SafeImage from "@/components/atoms/SafeImage";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine, MachineLog, Page } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineLogService } from "@/services/machineLogService";
import { machineService } from "@/services/machineService";

const LOG_PAGE_SIZE = 5;
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function ViewMachinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [machineError, setMachineError] = useState("");
  const [logPage, setLogPage] = useState<Page<MachineLog> | null>(null);
  const [currentLogPage, setCurrentLogPage] = useState(0);
  const [loadedLogRequestKey, setLoadedLogRequestKey] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const logRequestKey = `${id}:${currentLogPage}`;
  const logsLoading = loadedLogRequestKey !== logRequestKey;

  useEffect(() => {
    let active = true;
    machineService
      .getById(id)
      .then((result) => {
        if (active) setMachine(result);
      })
      .catch((error) => {
        if (!active) return;
        const message = getServiceErrorMessage(
          error,
          "Não foi possível carregar a máquina.",
        );
        setMachineError(message);
        toast.error(message);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    let active = true;
    machineLogService
      .list({
        machineId: id,
        page: currentLogPage,
        size: LOG_PAGE_SIZE,
        sort: "registeredAt,desc",
      })
      .then((result) => {
        if (active) setLogPage(result);
      })
      .catch((error) => {
        if (active) {
          toast.error(
            getServiceErrorMessage(error, "Não foi possível carregar o histórico da máquina."),
          );
        }
      })
      .finally(() => {
        if (active) setLoadedLogRequestKey(logRequestKey);
      });
    return () => {
      active = false;
    };
  }, [currentLogPage, id, logRequestKey]);

  const logColumns = useMemo<ColumnProps<MachineLog>[]>(() => [
    {
      header: "Registro",
      render: (log) => log.title || log.servicePerformed || "Log de manutenção",
    },
    {
      header: "Situação",
      render: (log) => log.taskSituation.replaceAll("_", " "),
    },
    {
      header: "Criticidade",
      render: (log) => log.taskCriticality,
    },
    {
      header: "Responsável",
      render: (log) => log.responsibleTeacherName || "Não informado",
    },
    {
      header: "Registrado em",
      render: (log) => dateFormatter.format(new Date(log.registeredAt)),
    },
  ], []);

  async function remove() {
    try {
      await machineService.remove(id);
      toast.success("Máquina excluída com sucesso.");
      router.push("/maquinas");
      router.refresh();
    } catch (error) {
      toast.error(
        getServiceErrorMessage(error, "Não foi possível excluir a máquina."),
      );
    }
  }

  if (!machine) {
    return (
      <LayoutDesktop>
        <PageFeedback
          variant={machineError ? "error" : "loading"}
          message={machineError || "Carregando máquina..."}
        />
      </LayoutDesktop>
    );
  }

  const isConforming = machine.condition === "CONFORME";

  return (
    <LayoutDesktop breadcrumbLabels={{ 1: machine.name }}>
      <section className="space-y-6">
        <PageHeader
          title={machine.name}
          description={`Patrimônio: ${machine.patrimony}`}
          actions={
            <>
              <Button
                href={`/maquinas/${id}/logs/novo`}
                variant="secondary"
                icon={ClipboardPlus}
              >
                Novo log
              </Button>
              <Button
                href={`/maquinas/${id}/editar`}
                icon={Pencil}
                iconOnly
                aria-label={`Editar máquina ${machine.name}`}
                title="Editar máquina"
              />
              <Button
                variant="danger"
                icon={Trash2}
                iconOnly
                aria-label={`Excluir máquina ${machine.name}`}
                title="Excluir máquina"
                onClick={() => setOpen(true)}
              />
            </>
          }
        />

        <section className="grid gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:grid-cols-[minmax(0,320px)_1fr]">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <SafeImage
              src={machine.image}
              alt={`Imagem da máquina ${machine.name}`}
              width={640}
              height={420}
              sizes="(max-width: 1024px) 100vw, 320px"
              className="h-64 w-full object-cover"
              unoptimized={Boolean(machine.image?.startsWith("data:"))}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Detail label="Condição">
              <LabelWithCircle
                status={isConforming ? "positive" : "negative"}
                text={isConforming ? "Conforme" : "Não conforme"}
              />
            </Detail>
            <Detail label="Local">{machine.placeName}</Detail>
            <Detail label="Tag">{machine.tag || "Não informada"}</Detail>
            <Detail label="Criada em">
              {dateFormatter.format(new Date(machine.createdAt))}
            </Detail>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Histórico da máquina</h2>
            <p className="text-sm text-gray-500">
              Acompanhe serviços, inspeções e intervenções registrados.
            </p>
          </div>
          {logsLoading ? (
            <PageFeedback message="Carregando histórico..." />
          ) : (
            <>
              <DataTable
                data={logPage?.content ?? []}
                columns={logColumns}
                searchKeys={["title", "description", "servicePerformed", "responsibleTeacherName"]}
                searchPlaceholder="Pesquisar no histórico..."
                emptyMessage="Nenhum log registrado para esta máquina."
              />
              <Pagination
                page={logPage?.number ?? currentLogPage}
                totalPages={logPage?.totalPages ?? 0}
                totalElements={logPage?.totalElements ?? 0}
                onPageChange={setCurrentLogPage}
              />
            </>
          )}
        </section>
      </section>
      <ConfirmDialog
        open={open}
        title="Excluir máquina"
        description={`Tem certeza que deseja excluir ${machine.name}?`}
        onCancel={() => setOpen(false)}
        onConfirm={remove}
      />
    </LayoutDesktop>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 font-medium text-gray-800">{children}</div>
    </div>
  );
}
