import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService } from './api.service';
import { DashboardSummary } from '../../shared/models/dashboard.model';
import {
  CreateCommentRequest,
  IssueFilters,
  CreateIssueRequest,
  Issue,
  IssueComment,
  UpdateIssueRequest
} from '../../shared/models/issue.model';
import { CreateProjectRequest, Project, UpdateProjectRequest } from '../../shared/models/project.model';
import { CreateSprintRequest, Sprint } from '../../shared/models/sprint.model';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  constructor(private readonly api: ApiService) {}

  getCurrentUser(): Observable<User> {
    return of({
      id: 'local-dev',
      name: 'Valere',
      email: 'v.youbi@hipposideros.de',
      role: 'Administrator',
      initials: 'VA'
    });
  }

  getProjects(): Observable<Project[]> {
    return this.api.get<Project[]>('projects');
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>('dashboard/summary');
  }

  createProject(request: CreateProjectRequest): Observable<Project> {
    return this.api.post<Project>('projects', request);
  }

  getProject(projectId: number): Observable<Project> {
    return this.api.get<Project>(`projects/${projectId}`);
  }

  updateProject(projectId: number, request: UpdateProjectRequest): Observable<Project> {
    return this.api.put<Project>(`projects/${projectId}`, request);
  }

  getProjectIssues(projectId: number): Observable<Issue[]> {
    return this.api.get<Issue[]>(`projects/${projectId}/issues`);
  }

  getSprints(projectId: number): Observable<Sprint[]> {
    return this.api.get<Sprint[]>(`projects/${projectId}/sprints`);
  }

  createSprint(projectId: number, request: CreateSprintRequest): Observable<Sprint> {
    return this.api.post<Sprint>(`projects/${projectId}/sprints`, request);
  }

  createIssue(projectId: number, request: CreateIssueRequest): Observable<Issue> {
    return this.api.post<Issue>(`projects/${projectId}/issues`, request);
  }

  getIssue(projectId: number, issueId: number): Observable<Issue> {
    return this.api.get<Issue>(`projects/${projectId}/issues/${issueId}`);
  }

  updateIssue(projectId: number, issueId: number, request: UpdateIssueRequest): Observable<Issue> {
    return this.api.put<Issue>(`projects/${projectId}/issues/${issueId}`, request);
  }

  getIssues(filters: IssueFilters = {}): Observable<Issue[]> {
    const params = new URLSearchParams();

    if (filters.query?.trim()) params.set('query', filters.query.trim());
    if (filters.projectId != null) params.set('projectId', String(filters.projectId));
    if (filters.status) params.set('status', filters.status);
    if (filters.issueType) params.set('issueType', filters.issueType);
    if (filters.label?.trim()) params.set('label', filters.label.trim());

    const query = params.toString();
    return this.api.get<Issue[]>(query ? `issues?${query}` : 'issues');
  }

  getComments(projectId: number, issueId: number): Observable<IssueComment[]> {
    return this.api.get<IssueComment[]>(`projects/${projectId}/issues/${issueId}/comments`);
  }

  createComment(projectId: number, issueId: number, request: CreateCommentRequest): Observable<IssueComment> {
    return this.api.post<IssueComment>(`projects/${projectId}/issues/${issueId}/comments`, request);
  }
}
