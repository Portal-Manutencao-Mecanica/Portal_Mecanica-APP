"use client";

import { useEffect, useState } from "react";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { StudentTable } from "@/components/organisms/StudentTable";
import type { Student } from "@/lib/api/types";
import { studentService } from "@/services/studentService";
import { getServiceErrorMessage } from "@/services/httpService";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    studentService.list().then(setStudents).catch((requestError) => {
      setError(getServiceErrorMessage(requestError, "Falha ao carregar alunos."));
    });
  }, []);

  return (
    <LayoutDesktop>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">


        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Alunos
            </h1>

            <p className="text-gray-500">
              Gerencie todos os alunos cadastrados.
            </p>
          </div>

    
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
        ) : (
          <StudentTable students={students} />
        )}

      </div>
    </LayoutDesktop>
  );
}
