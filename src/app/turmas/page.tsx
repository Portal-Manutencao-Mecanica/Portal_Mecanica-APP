"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import ClassGroupTable, { ClassGroupTableItem } from "@/components/organisms/ClassGroupTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";

export default function TurmasPage() {
  const [groups, setGroups] = useState<ClassGroupTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    classGroupBrowserService.list()
      .then((page) => setGroups(page.content))
      .catch((error) => toast.error(getServiceErrorMessage(error, "Não foi possível carregar as turmas.")))
      .finally(() => setLoading(false));
  }, []);

  const visibleGroups = groups.filter((group) =>
    statusFilter === "ALL" || (statusFilter === "ACTIVE" ? group.enabled : !group.enabled),
  );

  return (
    <LayoutDesktop>
      <div className="mx-auto max-w-7xl space-y-5 p-8">
        <div className="flex items-center justify-between gap-4">
          <div><h1 className="text-3xl font-bold">Turmas</h1><p className="text-gray-500">Visualize e gerencie as turmas cadastradas.</p></div>
          <Link href="/turmas/criar"><Button>Nova turma</Button></Link>
        </div>
        {loading ? <p className="text-center text-gray-500">Carregando turmas...</p> : <ClassGroupTable classGroups={visibleGroups} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />}
      </div>
    </LayoutDesktop>
  );
}
