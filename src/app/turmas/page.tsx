"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import Button from "@/components/atoms/Button";
import PageFeedback from "@/components/molecules/PageFeedback";
import PageHeader from "@/components/molecules/PageHeader";
import ClassGroupTable, { type ClassGroupTableItem } from "@/components/organisms/ClassGroupTable";
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
      <div className="space-y-6">
        <PageHeader
          title="Turmas"
          description="Visualize e gerencie as turmas cadastradas."
          actions={<Link href="/turmas/criar"><Button>Nova turma</Button></Link>}
        />
        {loading ? (
          <PageFeedback message="Carregando turmas..." />
        ) : (
          <ClassGroupTable classGroups={visibleGroups} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
        )}
      </div>
    </LayoutDesktop>
  );
}
