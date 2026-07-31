"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LayoutDesktop from "@/components/templates/LayoutDesktop";
import NotificationListSection from "@/components/organisms/NotificationListSection";
import type { NotificationData } from "@/props/NotificationDetailProps";
import { notificationService } from "@/services/notificationService";
import { getServiceErrorMessage } from "@/services/httpService";
export default function NotificationsPage(){const [notifications,setNotifications]=useState<NotificationData[]>([]);const [loading,setLoading]=useState(true);useEffect(()=>{notificationService.list().then((page)=>setNotifications(page.content)).catch((error)=>toast.error(getServiceErrorMessage(error,"Não foi possível carregar as notificações."))).finally(()=>setLoading(false));},[]);async function markAll(){try{await notificationService.markAllAsRead();setNotifications((current)=>current.map((item)=>({...item,statusRead:true})));toast.success("Todas as notificações foram marcadas como lidas.");}catch(error){toast.error(getServiceErrorMessage(error,"Não foi possível atualizar as notificações."));}}return <LayoutDesktop><div className="p-4 md:p-8">{loading?<p className="text-center text-gray-500">Carregando notificações...</p>:<NotificationListSection notifications={notifications} onMarkAllAsRead={markAll}/>}</div></LayoutDesktop>}