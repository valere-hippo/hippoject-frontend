import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { currentUser, issues, projects, sprints, users } from '../data/mock-data';
import { Issue } from '../../shared/models/issue.model';
import { Project } from '../../shared/models/project.model';
import { Sprint } from '../../shared/models/sprint.model';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  getCurrentUser(): Observable<User> {
    return of(currentUser);
  }

  getProjects(): Observable<Project[]> {
    return of(projects);
  }

  getProject(projectId: string): Observable<Project | undefined> {
    return of(projects.find((project) => project.id === projectId));
  }

  getProjectIssues(projectId: string): Observable<Issue[]> {
    return of(issues.filter((issue) => issue.projectId === projectId));
  }

  getIssues(): Observable<Issue[]> {
    return of(issues);
  }

  getProjectSprint(projectId: string): Observable<Sprint | undefined> {
    return of(sprints.find((sprint) => sprint.projectId === projectId));
  }

  getUsers(): Observable<User[]> {
    return of(users);
  }
}
