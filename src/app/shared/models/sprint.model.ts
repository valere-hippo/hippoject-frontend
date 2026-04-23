export interface Sprint {
  id: number;
  projectId: number;
  name: string;
  goal: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
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
