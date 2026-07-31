import type {
  MaintenanceType,
  TaskCriticality,
  TaskSituation,
} from "@/lib/api/types";

export type CalendarResponseDto = {
  id: string;
  scheduledAction: string;
  criticality: TaskCriticality;
  createdAt: string;
  scheduledFor: string;
  requestedAt: string | null;
  studentId: string | null;
  studentName: string | null;
  teacherId: string | null;
  teacherName: string | null;
  equipmentId: string | null;
  equipmentName: string | null;
  machineId: string | null;
  machineName: string | null;
  placeId: string | null;
  placeName: string | null;
  maintenanceType: MaintenanceType;
  status: TaskSituation;
};

export type CalendarItem = {
  day: string;
  hour: string;
  title: string;
};

export type CreateCalendarEventDto = {
  scheduledAction: string;
  criticality: TaskCriticality;
  scheduledFor: string;
  requestedAt: string;
  maintenanceType: MaintenanceType;
  equipmentId: string;
  machineId: string;
  placeId: string;
  studentId?: string;
  teacherId: string;
  status?: TaskSituation;
};
