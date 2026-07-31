"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import { StudentTable } from "@/components/organisms/StudentTable";
import UserCsvImport from "@/components/organisms/UserCsvImport";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Student } from "@/lib/api/types";
import { getServiceErrorMessage } from "@/services/httpService";
import { studentService } from "@/services/studentService";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    studentService.list()
      .then((data) => {
        if (!isCurrentRequest) return;
        setStudents(data);
        setHasError(false);
      })
      .catch((error) => {
        if (!isCurrentRequest) return;
        setHasError(true);
        toast.error(
          getServiceErrorMessage(error, "Não foi possível carregar os alunos."),
        );
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [requestVersion]);

  function retryLoadStudents() {
    setLoading(true);
    setRequestVersion((version) => version + 1);
  }

  const visibleStudents = students.filter((student) =>
    statusFilter === "ALL"
      || (statusFilter === "ACTIVE" ? student.enabled : !student.enabled),
  );

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold">Alunos</h1>
          <p className="text-gray-500">
            Visualize os alunos cadastrados e suas turmas vinculadas.
          </p>
        </div>

        <UserCsvImport onImportCompleted={retryLoadStudents} />

        {loading ? (
          <p className="py-12 text-center text-gray-500">
            Carregando alunos...
          </p>
        ) : hasError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">Não foi possível carregar os alunos.</p>
            <Button className="mx-auto mt-4" onClick={retryLoadStudents}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <StudentTable
            students={visibleStudents}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        )}
      </div>
    </LayoutDesktop>
  );
}
