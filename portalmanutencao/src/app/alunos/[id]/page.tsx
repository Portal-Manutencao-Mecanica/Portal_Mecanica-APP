"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import LabelWithCircle from "@/components/molecules/LabelWithCircle";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import type { Student } from "@/lib/api/types";
import { studentService } from "@/services/studentService";
import { getServiceErrorMessage } from "@/services/httpService";
export default function StudentPage(){const {id}=useParams<{id:string}>();const [student,setStudent]=useState<Student|null>(null);useEffect(()=>{studentService.getById(id).then(setStudent).catch((e)=>toast.error(getServiceErrorMessage(e,"Não foi possível carregar o aluno.")));},[id]);if(!student)return <LayoutDesktop><p className="p-8 text-center text-gray-500">Carregando aluno...</p></LayoutDesktop>;return <LayoutDesktop><div className="mx-auto max-w-5xl space-y-6 p-6"><div className="flex justify-between"><div><h1 className="text-3xl font-bold">Perfil do aluno</h1><p className="text-gray-500">Informações cadastradas.</p></div><Link href={`/alunos/${student.id}/editar`}><Button variant="warning">Editar</Button></Link></div><div className="grid grid-cols-1 gap-6 rounded-xl border bg-white p-6 md:grid-cols-2"><Detail label="Nome" value={student.name}/><Detail label="Número do crachá" value={student.numberCard}/><Detail label="E-mail" value={student.email}/><div><p className="text-sm text-gray-500">Status</p><LabelWithCircle status={student.enabled?"positive":"negative"} text={student.enabled?"Ativo":"Inativo"}/></div><Detail label="Turmas vinculadas" value={student.classGroupIds.length?String(student.classGroupIds.length):"Nenhuma"}/></div></div></LayoutDesktop>}
function Detail({label,value}:{label:string;value:string}){return <div><p className="text-sm text-gray-500">{label}</p><p className="text-lg font-medium">{value}</p></div>}