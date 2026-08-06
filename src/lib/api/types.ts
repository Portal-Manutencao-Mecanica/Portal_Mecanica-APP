export type UserRole = "ALUNO" | "PROFESSOR" | "ADMIN" | "COORDENADOR";

export interface OrganizationSummary {
  id: string;
  name: string;
}

export type HelperMaterialType =
  | "TECNICO"
  | "LUBRIFICACAO"
  | "MANUTENCAO_PREVENTIVA"
  | "MANUAL";

export interface HelperMaterial {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: HelperMaterialType;
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

export type AuthSession = Pick<
  LoginResponse,
  "expiresIn" | "passwordChangeRequired" | "user"
>;

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
  about: string | null;
  description: string;
  statusRead: boolean;
}

export interface ClassGroupPerson {
  id: string;
  numberCard: string;
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
  patrimony: string | null;
  tag: string | null;
  unitPrice: number;
  availableQuantity: number;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  numberCard: string;
  organizationId?: string;
}

export interface CreateEquipment {
  name: string;
  sap?: string;
  patrimony?: string;
  tag?: string;
  unitPrice: number;
  availableQuantity: number;
  media?: string;
}

export interface Machine {
  id: string;
  name: string;
  patrimony: string;
  condition: "CONFORME" | "NAO_CONFORME";
  tag: string;
  placeId: string;
  placeName: string;
  image: string | null;
  createdAt: string;
}

export interface Place {
  id: string;
  name: string;
}

export type EquipmentSituation = "OPERANDO" | "NAO_OPERANDO";
export type EquipmentCondition = "CONFORME" | "NAO_CONFORME";

export type AutonomousMaintenanceStatus =
  | "PENDENTE_APROVACAO_COORDENADOR"
  | "APROVADA_PELO_COORDENADOR"
  | "REPROVADA_PELO_COORDENADOR";

export interface AutonomousMaintenanceStudent {
  id: string;
  name: string;
  email: string;
  numberCard: string;
}

export interface AutonomousMaintenanceRequest {
  equipmentSituation: EquipmentSituation;
  scheduledFor: string;
  inspectedAt?: string | null;
  inspectedMachineId: string;
  equipmentCondition: EquipmentCondition;
  identifiedNonconformities?: string | null;
  studentIds: string[];
  responsibleTeacherId?: string;
}

export interface AutonomousMaintenanceApproval {
  approved: boolean;
  reason?: string | null;
}

export interface AutonomousMaintenance {
  id: string;
  equipmentSituation: EquipmentSituation;
  scheduledFor: string;
  inspectedAt: string | null;
  inspectedMachineId: string;
  inspectedMachineName: string;
  equipmentCondition: EquipmentCondition;
  identifiedNonconformities: string | null;
  responsibleTeacherId: string;
  responsibleTeacherName: string;
  students: AutonomousMaintenanceStudent[];
  status: AutonomousMaintenanceStatus;
  coordinatorApproverId: string | null;
  coordinatorApproverName: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  calendarEventId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMachine {
  name: string;
  patrimony: string;
  condition: Machine["condition"];
  tag?: string;
  placeId: string;
  image?: string;
}

export interface Buy {
  id: string;
  status: string;
  createdById: string;
  createdByName: string;
  notifiedTeacherId: string | null;
  notifiedTeacherName: string | null;
  purchaseJustification: string;
  classGroupId: string;
  classGroupAcronym: string;
  createdAt: string;
  items: BuyItem[];
}

export interface CreateBuyItem {
  equipmentId: string;
  quantity: number;
  technicalSpecification?: string;
  mechanicalSet?: string;
}

export interface CreateBuy {
  purchaseJustification: string;
  classGroupId: string;
  notifiedTeacherId?: string;
  items: CreateBuyItem[];
  mediaIds?: string[];
}

export interface BuyItem {
  id: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  technicalSpecification: string | null;
  sap: string | null;
  patrimony: string | null;
  tag: string | null;
  mechanicalSet: string | null;
}

export type RegistrationPeriod = "MATUTINO" | "VESPERTINO" | "NOTURNO";
export type Inconvenience5SStatus =
  | "EM_ANALISE"
  | "APROVADA"
  | "REPROVADA"
  | "NAO_VISUALIZADA"
  | "EM_ANDAMENTO"
  | "NOTIFICADO";

export interface CreateInconvenience5S {
  inconvenience: string;
  placeId: string;
  notifiedTeacherId: string;
  classGroupId: string;
  involvedStudentIds: string[];
  description: string;
  registrationPeriod: RegistrationPeriod;
  images: string[];
}

export interface Inconvenience5S {
  id: string;
  inconvenience: string;
  status: Inconvenience5SStatus;
  placeId: string;
  placeName: string;
  notifiedTeacherId: string;
  notifiedTeacherName: string;
  createdAt: string;
  classGroupId: string;
  classGroupAcronym: string;
  createdById: string;
  createdByName: string;
  involvedStudentIds: string[];
  description: string;
  registrationPeriod: RegistrationPeriod;
  media: Media[];
}

export interface MaintenanceRequestApi {
  id: string;
  status: string;
  sector: MaintenanceRequestSector;
  priority: MaintenanceRequestPriority;
  assignedStudentIds: string[];
  placeId: string;
  placeName: string;
  description: string;
  createdAt: string;
  notifiedTeacherId: string;
  notifiedTeacherName: string;
  machineId: string;
  machineName: string;
  approvedById: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  workOrderNumber: string | null;
  workOrderCreatedAt: string | null;
  workOrderCreatedById: string | null;
  workOrderCreatedByName: string | null;
  coordinatorApprovedById: string | null;
  coordinatorApprovedByName: string | null;
  coordinatorApprovedAt: string | null;
  coordinatorRejectionReason: string | null;
  media: Media[];
}

export interface Media {
  id: string;
  description: string | null;
  mediaType: string;
  image: string;
  originalName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

export type MaintenanceRequestSector =
  | "AREA_NAO_DESIGNADA"
  | "CENTRO_WEG"
  | "WEG_MANUTENCAO";

export type MaintenanceRequestPriority = "ALTA" | "MEDIA" | "BAIXA";

export interface CreateMaintenanceRequest {
  sector: MaintenanceRequestSector;
  priority: MaintenanceRequestPriority;
  placeId: string;
  description: string;
  notifiedTeacherId: string;
  machineId: string;
  images: string[];
}

export interface MaintenanceApproval {
  approved: boolean;
  reason?: string;
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

export interface PageQuery {
  page?: number;
  size?: number;
  sort?: string;
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
  maintenanceRequestId: string | null;
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

export interface UserImportItem {
  id: string;
  row: number;
  name: string;
  username: string;
  email: string;
  role: UserRole | null;
  organization: string;
  status: "CREATED" | "FAILED";
  createdUserId: string | null;
  errorCode: string | null;
  field: string | null;
  message: string | null;
}

export interface UserImportResponse {
  importId: string;
  filename: string;
  totalRows: number;
  created: number;
  failed: number;
  status: "PROCESSING" | "COMPLETED" | "COMPLETED_WITH_ERRORS";
  createdAt: string;
  completedAt: string | null;
  items: UserImportItem[];
}
