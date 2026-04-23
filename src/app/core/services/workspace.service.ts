import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService } from './api.service';
import { DashboardSummary } from '../../shared/models/dashboard.model';
import {
  CreateCommentRequest,
  CreateSavedIssueFilterRequest,
  IssueFilters,
  CreateIssueRequest,
  Issue,
  IssueComment,
  SavedIssueFilter,
  UpdateIssueRequest
} from '../../shared/models/issue.model';
import {
  CreateProjectMemberRequest,
  CreateProjectRequest,
  Project,
  ProjectMember,
  UpdateProjectRequest
} from '../../shared/models/project.model';
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

  getProjectMembers(projectId: number): Observable<ProjectMember[]> {
    return this.api.get<ProjectMember[]>(`projects/${projectId}/members`);
  }

  addProjectMember(projectId: number, request: CreateProjectMemberRequest): Observable<ProjectMember> {
    return this.api.post<ProjectMember>(`projects/${projectId}/members`, request);
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

  startSprint(projectId: number, sprintId: number): Observable<Sprint> {
    return this.api.put<Sprint>(`projects/${projectId}/sprints/${sprintId}/start`, {});
  }

  completeSprint(projectId: number, sprintId: number): Observable<Sprint> {
    return this.api.put<Sprint>(`projects/${projectId}/sprints/${sprintId}/complete`, {});
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

  getSavedIssueFilters(): Observable<SavedIssueFilter[]> {
    return this.api.get<SavedIssueFilter[]>('filters');
  }

  createSavedIssueFilter(request: CreateSavedIssueFilterRequest): Observable<SavedIssueFilter> {
    return this.api.post<SavedIssueFilter>('filters', request);
  }

  getComments(projectId: number, issueId: number): Observable<IssueComment[]> {
    return this.api.get<IssueComment[]>(`projects/${projectId}/issues/${issueId}/comments`);
  }

  createComment(projectId: number, issueId: number, request: CreateCommentRequest): Observable<IssueComment> {
    return this.api.post<IssueComment>(`projects/${projectId}/issues/${issueId}/comments`, request);
  }
}
