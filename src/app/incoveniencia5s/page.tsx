"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import DataTable from "@/components/organisms/DataTable";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Inconvenience5S } from "@/lib/api/types";
import type { ColumnProps } from "@/props/ColumnProps";
import { inconvenienceService } from "@/services/inconvenienceService";
import { getServiceErrorMessage } from "@/services/httpService";
export default function InconveniencePage(){const [items,setItems]=useState<Inconvenience5S[]>([]);const [loading,setLoading]=useState(true);useEffect(()=>{inconvenienceService.list().then((page)=>setItems(page.content)).catch((error)=>toast.error(getServiceErrorMessage(error,"Não foi possível carregar as ocorrências 5S."))).finally(()=>setLoading(false));},[]);const columns=useMemo<ColumnProps<Inconvenience5S>[]>(()=>[{header:"Ocorrência",accessorKey:"inconvenience"},{header:"Local",accessorKey:"placeName"},{header:"Turma",accessorKey:"classGroupAcronym"},{header:"Professor",accessorKey:"notifiedTeacherName"},{header:"Situação",render:(item)=><LabelWithCircle status={item.status==="RESOLVIDA"?"positive":"warning"} text={item.status.replaceAll("_"," ")} />},{header:"Ações",align:"right",render:(item)=><Link href={`/incoveniencia5s/${item.id}`}><Button>Ver detalhes</Button></Link>}],[]);return <LayoutDesktop><div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Inconveniências 5S</h1><p className="text-gray-500">Gerencie todas as ocorrências registradas.</p></div><Link href="/incoveniencia5s/nova"><Button>Nova ocorrência 5S</Button></Link></div>{loading?<p className="text-center text-gray-500">Carregando ocorrências...</p>:<DataTable data={items} columns={columns} searchKeys={["inconvenience","placeName","classGroupAcronym"]} searchPlaceholder="Pesquisar ocorrência..." emptyMessage="Nenhuma ocorrência encontrada."/>}</div></LayoutDesktop>}