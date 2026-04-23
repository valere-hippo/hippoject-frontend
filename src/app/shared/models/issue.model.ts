export type IssueStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

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
  priority: IssuePriority;
  assigneeId: string | null;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
  comments: IssueComment[];
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  priority: IssuePriority;
  status?: IssueStatus;
  assigneeId?: string | null;
}

export interface UpdateIssueRequest extends CreateIssueRequest {}

export interface CreateCommentRequest {
  body: string;
}
