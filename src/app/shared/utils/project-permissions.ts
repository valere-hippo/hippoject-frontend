import { ProjectMember, ProjectRole } from '../models/project.model';

export interface ProjectPermissions {
  role: ProjectRole | 'NONE';
  canEditProject: boolean;
  canManageMembers: boolean;
  canCreateIssues: boolean;
  canEditIssues: boolean;
  canManageSprints: boolean;
  canMoveBoard: boolean;
}

export function resolveProjectPermissions(
  userId: string,
  members: ProjectMember[],
  realmRoles: { workspaceAdmin: boolean; projectAdmin: boolean; projectManager: boolean }
): ProjectPermissions {
  if (realmRoles.workspaceAdmin || realmRoles.projectAdmin) {
    return allowAll('PROJECT_ADMIN');
  }
  if (realmRoles.projectManager) {
    return {
      role: 'PROJECT_MANAGER',
      canEditProject: true,
      canManageMembers: false,
      canCreateIssues: true,
      canEditIssues: true,
      canManageSprints: true,
      canMoveBoard: true
    };
  }

  const member = members.find((entry) => entry.userId.toLowerCase() === userId.toLowerCase());
  const role = member?.role ?? 'NONE';

  switch (role) {
    case 'PROJECT_ADMIN':
      return allowAll(role);
    case 'PROJECT_MANAGER':
      return {
        role,
        canEditProject: true,
        canManageMembers: false,
        canCreateIssues: true,
        canEditIssues: true,
        canManageSprints: true,
        canMoveBoard: true
      };
    case 'CONTRIBUTOR':
      return {
        role,
        canEditProject: false,
        canManageMembers: false,
        canCreateIssues: true,
        canEditIssues: true,
        canManageSprints: false,
        canMoveBoard: true
      };
    case 'VIEWER':
    case 'NONE':
    default:
      return {
        role,
        canEditProject: false,
        canManageMembers: false,
        canCreateIssues: false,
        canEditIssues: false,
        canManageSprints: false,
        canMoveBoard: false
      };
  }
}

function allowAll(role: ProjectRole): ProjectPermissions {
  return {
    role,
    canEditProject: true,
    canManageMembers: true,
    canCreateIssues: true,
    canEditIssues: true,
    canManageSprints: true,
    canMoveBoard: true
  };
}
