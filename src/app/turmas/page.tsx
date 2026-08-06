"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import ClassGroupTable, { type ClassGroupTableItem } from "@/components/organisms/ClassGroupTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useAuth } from "@/hooks/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Page } from "@/lib/api/types";
import { canManageClassGroups } from "@/lib/permissions";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";

const PAGE_SIZE = 10;

export default function TurmasPage() {
  const { user } = useAuth();
  const [groupPage, setGroupPage] = useState<Page<ClassGroupTableItem> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search);
  const requestKey = `${page}:${debouncedSearch}:${statusFilter}`;
  const loading = loadedRequestKey !== requestKey;
  const canManage = canManageClassGroups(user?.role);

  useEffect(() => {
    let active = true;
    classGroupBrowserService
      .list({
        page,
        size: PAGE_SIZE,
        sort: "acronym,asc",
        search: debouncedSearch.trim() || undefined,
        enabled: statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE",
      })
      .then((result) => {
        if (active) setGroupPage(result);
      })
      .catch((error) => {
        if (active) {
          toast.error(
            getServiceErrorMessage(error, "Não foi possível carregar as turmas."),
          );
        }
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch, page, requestKey, statusFilter]);

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Turmas"
          description="Visualize e gerencie as turmas cadastradas."
          actions={canManage ? <Button href="/turmas/criar">Nova turma</Button> : undefined}
        />
        {loading ? (
          <PageFeedback message="Carregando turmas..." />
        ) : (
          <>
            <ClassGroupTable
              classGroups={groupPage?.content ?? []}
              searchValue={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(0);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={(value) => {
                setStatusFilter(value);
                setPage(0);
              }}
              canManage={canManage}
            />
            <Pagination
              page={groupPage?.number ?? page}
              totalPages={groupPage?.totalPages ?? 0}
              totalElements={groupPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}