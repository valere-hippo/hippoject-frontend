import { ProjectRole } from './project.model';

export interface DirectoryMember {
  id: number;
  userId: string;
  displayName: string;
  role: ProjectRole;
}

export interface DirectoryProject {
  projectId: number;
  projectKey: string;
  projectName: string;
  members: DirectoryMember[];
}
