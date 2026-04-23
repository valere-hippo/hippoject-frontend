export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueType = 'STORY' | 'TASK' | 'BUG' | 'EPIC';

export interface IssueComment {
  id: number;
  body: string;
  authorId: string;
  createdAt: string;
}

export interface Issue {
  id: number;
  issueKey: string;
  projectId: number;
  projectKey: string;
  title: string;
  description: string;
  status: IssueStatus;
  issueType: IssueType;
  priority: IssuePriority;
  sprintId: number | null;
  sprintName: string | null;
  epicId: number | null;
  epicKey: string | null;
  epicTitle: string | null;
  labels: string[];
  epicProgressTotal: number;
  epicProgressDone: number;
  assigneeId: string | null;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
  comments: IssueComment[];
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  issueType: IssueType;
  priority: IssuePriority;
  status?: IssueStatus;
  sprintId?: number | null;
  epicId?: number | null;
  labels?: string[];
  assigneeId?: string | null;
}

export interface UpdateIssueRequest extends CreateIssueRequest {}

export interface IssueFilters {
  query?: string;
  projectId?: number;
  status?: IssueStatus | '';
  issueType?: IssueType | '';
  label?: string;
}

export interface SavedIssueFilter {
  id: number;
  name: string;
  query: string | null;
  projectId: number | null;
  status: IssueStatus | null;
  issueType: IssueType | null;
  label: string | null;
  createdAt: string;
}

export interface CreateSavedIssueFilterRequest {
  name: string;
  query?: string;
  projectId?: number | null;
  status?: IssueStatus | null;
  issueType?: IssueType | null;
  label?: string;
}

export interface CreateCommentRequest {
  body: string;
}
