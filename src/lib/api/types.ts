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

export interface CreateClassGroup {
  acronym: string;
  teacherIds: string[];
  studentIds: string[];
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
  media : any;
}

export interface Machine {
  id: string;
  name: string;
  patrimony: string;
  condition: "CONFORME" | "NAO_CONFORME";
  tag: string;
  placeId: string;
  placeName: string;
  createdAt: string;
}

export interface Place {
  id: string;
  name: string;
}

export interface CreateMachine {
  name: string;
  patrimony: string;
  condition: Machine["condition"];
  tag?: string;
  placeId: string;
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
  items: BuyItem[];
}

export interface BuyItem {
  id: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  technicalSpecification: string;
  sap: string;
  patrimony: string;
  tag: string;
  mechanicalSet: string;
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

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements?: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type TaskSituation = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
export type TaskCriticality = "BAIXA" | "MEDIA" | "ALTA";
export type MaintenanceType = "PREVENTIVA" | "CORRETIVA" | "PREDITIVA" | "AUTONOMA";

export interface MachineLog {
  id: string;
  title: string | null;
  description: string | null;
  executionReport: string | null;
  taskSituation: TaskSituation;
  machineId: string;
  machineName: string;
  servicePerformed: string | null;
  responsibleTeacherId: string | null;
  responsibleTeacherName: string | null;
  teacherConcludedAt: string | null;
  executionStartedAt: string | null;
  executionEndedAt: string | null;
  plannedAction: string | null;
  taskCriticality: TaskCriticality;
  placeId: string | null;
  placeName: string | null;
  maintenanceType: MaintenanceType | null;
  classGroupId: string | null;
  classGroupAcronym: string | null;
  assignedStudentIds: string[];
  reportLink: string | null;
  registeredAt: string;
}

export interface CreateMachineLog {
  title?: string;
  description?: string;
  executionReport?: string;
  taskSituation: TaskSituation;
  machineId: string;
  servicePerformed?: string;
  responsibleTeacherId?: string;
  teacherConcludedAt?: string;
  executionStartedAt?: string;
  executionEndedAt?: string;
  plannedAction?: string;
  taskCriticality: TaskCriticality;
  placeId?: string;
  maintenanceType?: MaintenanceType;
  classGroupId?: string;
  assignedStudentIds?: string[];
  reportLink?: string;
}
export type Teacher = Student;

interface CreateUserBaseRequest {
  name: string;
  username: string;
  email: string;
  organizationId?: string;
}

export type CreateUserRequest =
  | (CreateUserBaseRequest & {
      role: "ALUNO";
      studentData: { classGroupIds: string[] };
      teacherData?: never;
      coordinatorData?: never;
    })
  | (CreateUserBaseRequest & {
      role: "PROFESSOR";
      teacherData: { classGroupIds: string[] };
      studentData?: never;
      coordinatorData?: never;
    })
  | (CreateUserBaseRequest & {
      role: "COORDENADOR";
      coordinatorData: Record<string, never>;
      studentData?: never;
      teacherData?: never;
    })
  | (CreateUserBaseRequest & {
      role: "ADMIN";
      studentData?: never;
      teacherData?: never;
      coordinatorData?: never;
    });

export interface CreatedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: string;
  passwordChangeRequired: boolean;
  organization: OrganizationSummary;
  credentialsSent: boolean;
  emailStatus: string;
  createdAt: string;
}
