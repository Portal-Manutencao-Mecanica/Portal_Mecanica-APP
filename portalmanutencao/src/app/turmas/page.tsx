"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import ClassGroupTable, { ClassGroupTableItem } from "@/components/organisms/ClassGroupTable";
import { classGroupBrowserService } from "@/services/classGroupBrowserService";
import { getServiceErrorMessage } from "@/services/httpService";
export default function TurmasPage(){const [groups,setGroups]=useState<ClassGroupTableItem[]>([]);const [loading,setLoading]=useState(true);useEffect(()=>{classGroupBrowserService.list().then((page) => setGroups(page.content)).catch((error)=>toast.error(getServiceErrorMessage(error,"NÃ£o foi possÃ­vel carregar as turmas."))).finally(()=>setLoading(false));},[]);return <LayoutDesktop><div className="mx-auto max-w-7xl space-y-5 p-8"><div><h1 className="text-3xl font-bold">Turmas</h1><p className="text-gray-500">Visualize e gerencie as turmas cadastradas.</p></div>{loading?<p className="text-center text-gray-500">Carregando turmas...</p>:<ClassGroupTable classGroups={groups}/>}</div></LayoutDesktop>}