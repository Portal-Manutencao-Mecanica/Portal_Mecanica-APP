"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import { MachineTable } from "@/components/organisms/MachineTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Machine } from "@/lib/api/types";
import { machineService } from "@/services/machineService";
import { getServiceErrorMessage } from "@/services/httpService";
export default function MachinesPage() { const [machines,setMachines]=useState<Machine[]>([]); const [loading,setLoading]=useState(true); useEffect(()=>{ machineService.list().then((page)=>setMachines(page.content)).catch((error)=>toast.error(getServiceErrorMessage(error,"Não foi possível carregar as máquinas."))).finally(()=>setLoading(false)); },[]); return <LayoutDesktop><div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 className="text-2xl font-bold md:text-3xl">Máquinas</h1><p className="text-gray-500">Visualize todas as máquinas cadastradas.</p></div><Link href="/maquinas/criar"><Button>Nova máquina</Button></Link></div>{loading ? <p className="text-center text-gray-500">Carregando máquinas...</p> : <MachineTable machines={machines} />}</div></LayoutDesktop>; }