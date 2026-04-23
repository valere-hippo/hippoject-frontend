export type IssueStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Issue {
  id: string;
  key: string;
  title: string;
  summary: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId: string;
  reporterId: string;
  projectId: string;
  sprintId?: string;
  estimate: number;
  labels: string[];
  updatedAt: string;
}
