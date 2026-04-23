export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';

export interface Sprint {
  id: number;
  projectId: number;
  name: string;
  goal: string;
  startsAt: string;
  endsAt: string;
  status: SprintStatus;
  active: boolean;
  completedAt: string | null;
  createdAt: string;
  issueCount: number;
}

export interface CreateSprintRequest {
  name: string;
  goal: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
}
