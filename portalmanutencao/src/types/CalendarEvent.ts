export type CalendarResponseDto = {
  id: string;
  numberCard: string;
  scheduledAction: string;
  criticality: string;
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
  maintenanceType: string;
  status: string;
};

export type CreateCalendarEventDto = {
  scheduledAction: string;
  criticality: string;
  scheduledFor: string;
  maintenanceType: string;
  equipmentId?: string;
  machineId?: string;
  placeId?: string;
  studentId?: string;
  teacherId?: string;
};
