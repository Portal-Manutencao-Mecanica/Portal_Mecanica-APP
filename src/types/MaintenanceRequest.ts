export type MaintenanceRequestStatus =
  | "AGUARDANDO_APROVACAO_COORDENADOR"
  | "CONCLUIDA"
  | "REPROVADA_PELO_COORDENADOR";

export type RequestPriority = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export interface MaintenanceRequest {
  id: string;
  numberCard: string;
  status: MaintenanceRequestStatus;
  priority: RequestPriority;
  sector: string;
  machine: string;
  place: string;
  description: string;
  createdAt: string;
  createdBy: string;
  notifiedTeacher: string;
  teacherApprovedAt: string;
  assignedStudents: string[];
  workOrder: {
    number: string;
    technician: string;
    description: string;
    completedAt: string;
  };
}
