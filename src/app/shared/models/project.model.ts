export interface Project {
  id: string;
  key: string;
  name: string;
  lead: string;
  description: string;
  progress: number;
  health: 'on-track' | 'at-risk' | 'blocked';
  teamSize: number;
  activeSprint: string;
  targetDate: string;
}
