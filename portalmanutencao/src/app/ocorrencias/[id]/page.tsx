"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { MaintenanceRequestApi } from "@/lib/api/types";
import { maintenanceRequestService } from "@/services/maintenanceRequestService";
import { getServiceErrorMessage } from "@/services/httpService";
export default function OccurrenceDetailsPage({params}:{params:Promise<{id:string}>}){const {id}=use(params);const [request,setRequest]=useState<MaintenanceRequestApi|null>(null);useEffect(()=>{maintenanceRequestService.getById(id).then(setRequest).catch((e)=>toast.error(getServiceErrorMessage(e,"Não foi possível carregar a ocorrência.")));},[id]);if(!request)return <LayoutDesktop><p className="p-8 text-center text-gray-500">Carregando ocorrência...</p></LayoutDesktop>;return <LayoutDesktop><div className="mx-auto max-w-5xl space-y-6 p-6"><div className="flex justify-between"><div><h1 className="text-3xl font-bold">Ocorrência de manutenção</h1><p className="text-gray-500">{request.machineName}</p></div><LabelWithCircle status={request.status==="CONCLUIDA"?"positive":request.status.includes("REPROV")?"negative":"warning"} text={request.status.replaceAll("_"," ")}/></div><div className="grid grid-cols-1 gap-6 rounded-xl border bg-white p-6 md:grid-cols-2"><Detail label="Máquina" value={request.machineName}/><Detail label="Local" value={request.placeName}/><Detail label="Professor notificado" value={request.notifiedTeacherName}/><Detail label="Prioridade" value={request.priority}/><Detail label="Setor" value={request.sector}/><div className="md:col-span-2"><Detail label="Descrição" value={request.description}/></div></div><Link href="/ocorrencias"><Button variant="secondary">Voltar</Button></Link></div></LayoutDesktop>}
function Detail({label,value}:{label:string;value:string}){return <div><p className="text-sm text-gray-500">{label}</p><p className="font-medium">{value||"Não informado"}</p></div>}