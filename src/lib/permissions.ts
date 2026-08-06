import type { UserRole } from "@/lib/api/types";

type AuthenticatedRole = UserRole | null | undefined;

function isManager(role: AuthenticatedRole) {
  return role === "ADMIN" || role === "COORDENADOR";
}

export function canManageMachines(role: AuthenticatedRole) {
  return isManager(role);
}

export function canManageClassGroups(role: AuthenticatedRole) {
  return isManager(role);
}

export function canManageEquipment(role: AuthenticatedRole) {
  return isManager(role);
}

export function canCreateCalendarEvents(role: AuthenticatedRole) {
  return role === "ADMIN";
}

export function canManageCalendarEvents(role: AuthenticatedRole) {
  return role === "ADMIN";
}

export function canCreateInconvenience(role: AuthenticatedRole) {
  return role === "ADMIN" || role === "PROFESSOR";
}

export function canChangeInconvenienceStatus(role: AuthenticatedRole) {
  return isManager(role);
}

export function canCreateAutonomousMaintenance(role: AuthenticatedRole) {
  return role === "PROFESSOR" || isManager(role);
}

export function canManageAutonomousMaintenance(role: AuthenticatedRole) {
  return isManager(role);
}

export function canManageOccurrences(role: AuthenticatedRole) {
  return isManager(role);
}

export function canManageOrganizations(role: AuthenticatedRole) {
  return isManager(role);
}

export function canManageUsers(role: AuthenticatedRole) {
  return isManager(role);
}

export function canEditUsers(role: AuthenticatedRole) {
  return role === "ADMIN";
}

export function canEditPurchase(
  role: AuthenticatedRole,
  userId: string | null | undefined,
  purchase: { createdById: string; status: string },
) {
  return isManager(role)
    || (Boolean(userId)
      && purchase.createdById === userId
      && purchase.status === "NAO_VISUALIZADO");
}

export function isUnauthorizedRoute(pathname: string, role: AuthenticatedRole) {
  if (!role) return false;

  const readOnlyResourceRoute = pathname === "/maquinas/criar"
    || /^\/maquinas\/[^/]+\/(editar|logs\/novo)$/.test(pathname)
    || pathname === "/turmas/criar"
    || /^\/turmas\/[^/]+\/editar$/.test(pathname)
    || pathname === "/equipamentos/novo"
    || /^\/equipamentos\/[^/]+\/editar$/.test(pathname);

  if (readOnlyResourceRoute && !isManager(role)) return true;
  if ((pathname === "/organizacoes" || pathname.startsWith("/organizacoes/")) && !isManager(role)) return true;
  if ((pathname === "/usuarios" || pathname === "/usuarios/novo") && !isManager(role)) {
    return true;
  }
  if (/^\/usuarios\/[^/]+\/editar$/.test(pathname) && role !== "ADMIN") return true;


  if (/^\/alunos\/[^/]+\/editar$/.test(pathname) && role !== "ADMIN") return true;
  if (pathname === "/incoveniencia5s/nova" && !canCreateInconvenience(role)) return true;
  if (pathname === "/manutencao-autonoma/nova"
    && !canCreateAutonomousMaintenance(role)) return true;
  if (/^\/manutencao-autonoma\/[^/]+\/editar$/.test(pathname)
    && !canManageAutonomousMaintenance(role)) return true;
  if (/^\/ocorrencias\/[^/]+\/editar$/.test(pathname)
    && !canManageOccurrences(role)) return true;

  return false;
}
