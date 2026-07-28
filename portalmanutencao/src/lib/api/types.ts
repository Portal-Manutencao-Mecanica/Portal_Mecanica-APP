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
