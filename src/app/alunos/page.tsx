"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import Pagination from "@/components/molecules/Pagination";
import { StudentTable } from "@/components/organisms/StudentTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { Page, Student } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { studentService } from "@/services/studentService";

const PAGE_SIZE = 10;

export default function StudentsPage() {
  const [studentPage, setStudentPage] = useState<Page<Student> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [requestVersion, setRequestVersion] = useState(0);
  const debouncedSearch = useDebouncedValue(search);
  const requestKey = `${page}:${debouncedSearch}:${statusFilter}:${requestVersion}`;
  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    let active = true;
    studentService
      .list({
        page,
        size: PAGE_SIZE,
        sort: "name,asc",
        search: debouncedSearch.trim() || undefined,
        enabled:
          statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE",
      })
      .then((data) => {
        if (!active) return;
        setStudentPage(data);
        setHasError(false);
      })
      .catch((error) => {
        if (!active) return;
        setHasError(true);
        toast.error(
          getServiceErrorMessage(error, "Não foi possível carregar os alunos."),
        );
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, page, requestKey, requestVersion, statusFilter]);

  function retryLoadStudents() {
    setRequestVersion((version) => version + 1);
  }

  return (
    <LayoutDesktop>
      <section className="space-y-6">
        <PageHeader
          title="Alunos"
          description="Visualize os alunos cadastrados e suas turmas vinculadas."
        />

        {loading ? (
          <PageFeedback message="Carregando alunos..." />
        ) : hasError ? (
          <div className="space-y-4">
            <PageFeedback variant="error" message="Não foi possível carregar os alunos." />
            <div className="flex justify-center">
              <Button onClick={retryLoadStudents}>Tentar novamente</Button>
            </div>
          </div>
        ) : (
          <>
            <StudentTable
              students={studentPage?.content ?? []}
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
            />
            <Pagination
              page={studentPage?.number ?? page}
              totalPages={studentPage?.totalPages ?? 0}
              totalElements={studentPage?.totalElements ?? 0}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </LayoutDesktop>
  );
}
