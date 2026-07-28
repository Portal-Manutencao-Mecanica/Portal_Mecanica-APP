export type UserRole = "ALUNO" | "PROFESSOR" | "ADMIN" | "COORDENADOR";

export interface OrganizationSummary {
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: string;
  passwordChangeRequired: boolean;
  organization: OrganizationSummary | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  passwordChangeRequired: boolean;
  user: UserProfile;
}

export interface ApiErrorPayload {
  status?: number;
  error?: string;
  message?: string;
  errors?: Record<string, string>;
}

export interface Notification {
  id: string;
  email: string;
  title: string;
  about: string;
  description: string;
  statusRead: boolean;
}

export interface ClassGroupPerson {
  id: string;
  name: string;
  email: string;
}

export interface ClassGroup {
  id: string;
  acronym: string;
  enabled: boolean;
  teachers: ClassGroupPerson[];
  students: ClassGroupPerson[];
}

export interface Student {
  id: string;
  numberCard: string;
  name: string;
  email: string;
  role: UserRole;
  classGroupIds: string[];
  enabled: boolean;
  accountNonLocked: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  sap: string | null;
  unitPrice: number;
  availableQuantity: number;
}

export interface CreateEquipment {
  name: string;
  sap?: string;
  unitPrice: number;
  availableQuantity: number;
}

export interface Machine {
  id: string;
  name: string;
  patrimony: string;
  condition: "ATIVA" | "MANUTENCAO" | "INATIVA";
  tag: string;
  placeId: string;
  placeName: string;
  createdAt: string;
}

export interface Buy {
  id: string;
  status: string;
  createdById: string;
  createdByName: string;
  notifiedTeacherId: string;
  notifiedTeacherName: string;
  purchaseJustification: string;
  classGroupId: string;
  classGroupAcronym: string;
  createdAt: string;
  items: unknown[];
}

export interface Inconvenience5S {
  id: string;
  inconvenience: string;
  status: string;
  placeId: string;
  placeName: string;
  notifiedTeacherId: string;
  notifiedTeacherName: string;
  createdAt: string;
  classGroupId: string;
  classGroupAcronym: string;
  involvedStudentIds: string[];
  description: string;
  registrationPeriod: string;
}

export interface MaintenanceRequestApi {
  id: string;
  status: string;
  sector: string;
  priority: string;
  assignedStudentIds: string[];
  placeId: string;
  placeName: string;
  description: string;
  createdAt: string;
  notifiedTeacherId: string;
  notifiedTeacherName: string;
  machineId: string;
  machineName: string;
}
