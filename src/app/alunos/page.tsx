"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
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
        toast.error(getServiceErrorMessage(error, "Não foi possível carregar os alunos."));
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
      <section className="space-y-6">
        <PageHeader
          title="Alunos"
          description="Visualize os alunos cadastrados e suas turmas vinculadas."
        />

        <UserCsvImport onImportCompleted={retryLoadStudents} />

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
          <StudentTable
            students={visibleStudents}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        )}
      </section>
    </LayoutDesktop>
  );
}
