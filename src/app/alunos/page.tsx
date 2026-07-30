"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { StudentTable } from "@/components/organisms/StudentTable";
import type { Student } from "@/lib/api/types";
import { studentService } from "@/services/studentService";
import { getServiceErrorMessage } from "@/services/httpService";
export default function StudentsPage() { const [students, setStudents] = useState<Student[]>([]); const [loading, setLoading] = useState(true); useEffect(() => { studentService.list().then(setStudents).catch((error) => toast.error(getServiceErrorMessage(error, "Não foi possível carregar os alunos."))).finally(() => setLoading(false)); }, []); return <LayoutDesktop><div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8"><div><h1 className="text-3xl font-bold">Alunos</h1><p className="text-gray-500">Gerencie todos os alunos cadastrados.</p></div>{loading ? <p className="text-center text-gray-500">Carregando alunos...</p> : <StudentTable students={students} />}</div></LayoutDesktop>; }