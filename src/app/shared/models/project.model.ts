export interface Project {
  id: number;
  key: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  issueCount: number;
  memberCount: number;
}

export type ProjectRole = 'PROJECT_ADMIN' | 'PROJECT_MANAGER' | 'CONTRIBUTOR' | 'VIEWER';

export interface ProjectMember {
  id: number;
  projectId: number;
  userId: string;
  displayName: string;
  email: string | null;
  role: ProjectRole;
  addedAt: string;
}

export interface CreateProjectMemberRequest {
  userId: string;
  displayName: string;
  email?: string;
  role: ProjectRole;
}

export interface ProjectActivityItem {
  type: string;
  title: string;
  detail: string;
  occurredAt: string;
}

export interface CreateProjectRequest {
  key: string;
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
}
