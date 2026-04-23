export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  completedPoints: number;
}
