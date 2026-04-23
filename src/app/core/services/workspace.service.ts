import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService } from './api.service';
import { DashboardSummary } from '../../shared/models/dashboard.model';
import { DirectoryProject } from '../../shared/models/directory.model';
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
import { NotificationItem } from '../../shared/models/notification.model';
import {
  CreateProjectMemberRequest,
  ProjectActivityItem,
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

  getDirectory(): Observable<DirectoryProject[]> {
    return this.api.get<DirectoryProject[]>('directory');
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

  removeProjectMember(projectId: number, memberId: number): Observable<void> {
    return this.api.delete<void>(`projects/${projectId}/members/${memberId}`);
  }

  getProjectActivity(projectId: number): Observable<ProjectActivityItem[]> {
    return this.api.get<ProjectActivityItem[]>(`projects/${projectId}/activity`);
  }

  getProjectIssues(projectId: number, includeArchived = false): Observable<Issue[]> {
    return this.api.get<Issue[]>(`projects/${projectId}/issues`, { includeArchived });
  }

  getSprints(projectId: number, includeArchived = false): Observable<Sprint[]> {
    return this.api.get<Sprint[]>(`projects/${projectId}/sprints`, { includeArchived });
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

  deleteSprint(projectId: number, sprintId: number): Observable<Sprint> {
    return this.api.delete<Sprint>(`projects/${projectId}/sprints/${sprintId}`);
  }

  restoreSprint(projectId: number, sprintId: number): Observable<Sprint> {
    return this.api.put<Sprint>(`projects/${projectId}/sprints/${sprintId}/restore`, {});
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

  deleteIssue(projectId: number, issueId: number): Observable<Issue> {
    return this.api.delete<Issue>(`projects/${projectId}/issues/${issueId}`);
  }

  restoreIssue(projectId: number, issueId: number): Observable<Issue> {
    return this.api.put<Issue>(`projects/${projectId}/issues/${issueId}/restore`, {});
  }

  getIssues(filters: IssueFilters = {}): Observable<Issue[]> {
    const params = new URLSearchParams();

    if (filters.query?.trim()) params.set('query', filters.query.trim());
    if (filters.projectId != null) params.set('projectId', String(filters.projectId));
    if (filters.status) params.set('status', filters.status);
    if (filters.issueType) params.set('issueType', filters.issueType);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.assigneeId?.trim()) params.set('assigneeId', filters.assigneeId.trim());
    if (filters.label?.trim()) params.set('label', filters.label.trim());
    if (filters.includeArchived) params.set('includeArchived', 'true');

    const query = params.toString();
    return this.api.get<Issue[]>(query ? `issues?${query}` : 'issues');
  }

  getSavedIssueFilters(): Observable<SavedIssueFilter[]> {
    return this.api.get<SavedIssueFilter[]>('filters');
  }

  createSavedIssueFilter(request: CreateSavedIssueFilterRequest): Observable<SavedIssueFilter> {
    return this.api.post<SavedIssueFilter>('filters', request);
  }

  deleteSavedIssueFilter(filterId: number): Observable<void> {
    return this.api.delete<void>(`filters/${filterId}`);
  }

  getNotifications(): Observable<NotificationItem[]> {
    return this.api.get<NotificationItem[]>('notifications');
  }

  markNotificationRead(notificationId: number): Observable<NotificationItem> {
    return this.api.put<NotificationItem>(`notifications/${notificationId}/read`, {});
  }

  getComments(projectId: number, issueId: number): Observable<IssueComment[]> {
    return this.api.get<IssueComment[]>(`projects/${projectId}/issues/${issueId}/comments`);
  }

  createComment(projectId: number, issueId: number, request: CreateCommentRequest): Observable<IssueComment> {
    return this.api.post<IssueComment>(`projects/${projectId}/issues/${issueId}/comments`, request);
  }
}
