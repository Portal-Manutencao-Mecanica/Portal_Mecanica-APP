"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Inconvenience5S } from "@/lib/api/types";
import { inconvenienceService } from "@/services/inconvenienceService";
import { getServiceErrorMessage } from "@/services/httpService";
export default function InconvenienceDetailsPage({params}:{params:Promise<{id:string}>}){const {id}=use(params);const [item,setItem]=useState<Inconvenience5S|null>(null);useEffect(()=>{inconvenienceService.getById(id).then(setItem).catch((e)=>toast.error(getServiceErrorMessage(e,"Não foi possível carregar a ocorrência 5S.")));},[id]);if(!item)return <LayoutDesktop><p className="p-8 text-center text-gray-500">Carregando ocorrência...</p></LayoutDesktop>;return <LayoutDesktop><div className="mx-auto max-w-5xl space-y-6 p-6"><div className="flex justify-between"><div><h1 className="text-3xl font-bold">Ocorrência 5S</h1><p className="text-gray-500">{item.inconvenience}</p></div><LabelWithCircle status={item.status==="RESOLVIDA"?"positive":"warning"} text={item.status.replaceAll("_"," ")}/></div><div className="grid grid-cols-1 gap-6 rounded-xl border bg-white p-6 md:grid-cols-2"><Detail label="Local" value={item.placeName}/><Detail label="Turma" value={item.classGroupAcronym}/><Detail label="Professor notificado" value={item.notifiedTeacherName}/><Detail label="Período" value={item.registrationPeriod}/><div className="md:col-span-2"><Detail label="Descrição" value={item.description}/></div></div><Link href="/incoveniencia5s"><Button variant="secondary">Voltar</Button></Link></div></LayoutDesktop>}
function Detail({label,value}:{label:string;value:string}){return <div><p className="text-sm text-gray-500">{label}</p><p className="font-medium">{value||"Não informado"}</p></div>}