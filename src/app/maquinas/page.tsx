"use client";

import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import { MachineTable } from "@/components/organisms/MachineTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Machine, Page } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { machineService } from "@/services/machineService";

const PAGE_SIZE = 10;

export default function MachinesPage() {
  const [machinePage, setMachinePage] = useState<Page<Machine> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState<"" | Machine["condition"]>("");
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const requestKey = `${page}:${debouncedSearch}:${condition}`;
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    machineService
      .list({
        page,
        size: PAGE_SIZE,
        sort: "createdAt,desc",
        search: debouncedSearch.trim() || undefined,
        condition: condition || undefined,
      })
      .then((result) => {
        if (active) {
          setMachinePage(result);
          setError("");
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            getServiceErrorMessage(loadError, "Não foi possível carregar as máquinas."),
          );
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });

    return () => {
      active = false;
    };
  }, [condition, debouncedSearch, page, requestKey]);

  function changeSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  function changeCondition(value: "" | Machine["condition"]) {
    setCondition(value);
    setPage(0);
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Máquinas"
          description="Visualize e gerencie as máquinas cadastradas."
          actions={<Button href="/maquinas/criar">Nova máquina</Button>}
        />
        {loading ? (
          <PageFeedback message="Carregando máquinas..." />
        ) : error ? (
          <PageFeedback variant="error" message={error} />
        ) : (
          <>
            <MachineTable
              machines={machinePage?.content ?? []}
              searchValue={search}
              onSearchChange={changeSearch}
              condition={condition}
              onConditionChange={changeCondition}
            />
            <Pagination
              page={machinePage?.number ?? page}
              totalPages={machinePage?.totalPages ?? 0}
              totalElements={machinePage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}
