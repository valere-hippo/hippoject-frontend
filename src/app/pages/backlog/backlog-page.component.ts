import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { Issue } from '../../shared/models/issue.model';
import { CreateSprintRequest } from '../../shared/models/sprint.model';
import { resolveProjectPermissions } from '../../shared/utils/project-permissions';

@Component({
  selector: 'app-backlog-page',
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './backlog-page.component.html',
  styleUrl: './backlog-page.component.scss'
})
export class BacklogPageComponent {
  private readonly auth = inject(AuthService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly refresh$ = new Subject<void>();

  protected readonly sprintForm: CreateSprintRequest = {
    name: '',
    goal: '',
    startsAt: '',
    endsAt: '',
    active: true
  };

  protected isSavingSprint = false;
  protected sprintActionId: number | null = null;
  protected deletingSprintId: number | null = null;

  protected readonly vm$ = combineLatest({
    projectId: this.route.paramMap.pipe(map((params) => Number(params.get('projectId')))),
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(({ projectId }) =>
      combineLatest({
        project: this.workspaceService.getProject(projectId),
        issues: this.workspaceService.getProjectIssues(projectId),
        sprints: this.workspaceService.getSprints(projectId),
        members: this.workspaceService.getProjectMembers(projectId)
      }).pipe(
        map((data) => ({
          ...data,
          projectId,
          permissions: resolveProjectPermissions(this.auth.userId(), data.members, {
            workspaceAdmin: this.auth.hasAnyRole('hippoject-admin'),
            projectAdmin: this.auth.hasAnyRole('project-admin'),
            projectManager: this.auth.hasAnyRole('project-manager')
          }),
          stats: {
            active: data.sprints.filter((sprint) => sprint.status === 'ACTIVE').length,
            planned: data.sprints.filter((sprint) => sprint.status === 'PLANNED').length,
            completed: data.sprints.filter((sprint) => sprint.status === 'COMPLETED').length
          }
        }))
      )
    )
  );

  protected createSprint(projectId: number): void {
    this.isSavingSprint = true;
    this.workspaceService.createSprint(projectId, this.sprintForm).subscribe({
      next: () => {
        this.sprintForm.name = '';
        this.sprintForm.goal = '';
        this.sprintForm.startsAt = '';
        this.sprintForm.endsAt = '';
        this.sprintForm.active = true;
        this.isSavingSprint = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingSprint = false;
      }
    });
  }

  protected startSprint(projectId: number, sprintId: number): void {
    this.sprintActionId = sprintId;
    this.workspaceService.startSprint(projectId, sprintId).subscribe({
      next: () => {
        this.sprintActionId = null;
        this.refresh$.next();
      },
      error: () => {
        this.sprintActionId = null;
      }
    });
  }

  protected completeSprint(projectId: number, sprintId: number): void {
    this.sprintActionId = sprintId;
    this.workspaceService.completeSprint(projectId, sprintId).subscribe({
      next: () => {
        this.sprintActionId = null;
        this.refresh$.next();
      },
      error: () => {
        this.sprintActionId = null;
      }
    });
  }

  protected deleteSprint(projectId: number, sprintId: number): void {
    if (!window.confirm('Sprint wirklich löschen? Zugeordnete Issues landen im Backlog.')) {
      return;
    }
    this.deletingSprintId = sprintId;
    this.workspaceService.deleteSprint(projectId, sprintId).subscribe({
      next: () => {
        this.deletingSprintId = null;
        this.refresh$.next();
      },
      error: () => {
        this.deletingSprintId = null;
      }
    });
  }

  protected assignSprint(projectId: number, issue: Issue, sprintId: number | null): void {
    this.workspaceService
      .updateIssue(projectId, issue.id, {
        title: issue.title,
        description: issue.description,
        issueType: issue.issueType,
        priority: issue.priority,
        status: issue.status,
        labels: issue.labels,
        sprintId,
        epicId: issue.epicId,
        assigneeId: issue.assigneeId ?? ''
      })
      .subscribe(() => this.refresh$.next());
  }
}
