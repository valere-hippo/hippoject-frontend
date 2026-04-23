export interface Project {
  id: number;
  key: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  issueCount: number;
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
