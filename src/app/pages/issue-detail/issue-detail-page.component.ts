import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap, tap } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { Issue, IssuePriority, IssueStatus, IssueType, UpdateIssueRequest } from '../../shared/models/issue.model';
import { resolveProjectPermissions } from '../../shared/utils/project-permissions';
import { issuePriorityLabel, issueStatusLabel, issueTypeLabel, projectRoleLabel } from '../../shared/utils/ui-labels';

@Component({
  selector: 'app-issue-detail-page',
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './issue-detail-page.component.html',
  styleUrl: './issue-detail-page.component.scss'
})
export class IssueDetailPageComponent {
  private readonly auth = inject(AuthService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly realtimeService = inject(RealtimeService);
  private readonly route = inject(ActivatedRoute);
  private readonly refresh$ = new Subject<void>();

  protected readonly priorities: IssuePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  protected readonly statuses: IssueStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  protected readonly issueTypes: IssueType[] = ['STORY', 'TASK', 'BUG', 'EPIC'];
  protected readonly issuePriorityLabel = issuePriorityLabel;
  protected readonly issueStatusLabel = issueStatusLabel;
  protected readonly issueTypeLabel = issueTypeLabel;
  protected readonly projectRoleLabel = projectRoleLabel;

  protected readonly issueForm: UpdateIssueRequest = {
    title: '',
    description: '',
    issueType: 'TASK',
    priority: 'MEDIUM',
    status: 'TODO',
    labels: [],
    sprintId: null,
    epicId: null,
    assigneeId: ''
  };
  protected issueLabelsText = '';

  protected commentBody = '';
  protected isSavingComment = false;
  protected isSavingIssue = false;
  protected isDeletingIssue = false;
  protected lastDeletedIssue: Issue | null = null;

  constructor() {
    this.realtimeService.events$.subscribe((event) => {
      const payload = event.payload as { projectId?: number } | null;
      if (event.type === 'project-updated' && !this.lastDeletedIssue && payload?.projectId === Number(this.route.snapshot.paramMap.get('projectId'))) {
        this.refresh$.next();
      }
    });
  }

  protected readonly vm$ = combineLatest({
    params: this.route.paramMap.pipe(
      map((params) => ({
        projectId: Number(params.get('projectId')),
        issueId: Number(params.get('issueId'))
      }))
    ),
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(({ params }) =>
      combineLatest({
        issue: this.workspaceService.getIssue(params.projectId, params.issueId),
        comments: this.workspaceService.getComments(params.projectId, params.issueId),
        sprints: this.workspaceService.getSprints(params.projectId),
        projectIssues: this.workspaceService.getProjectIssues(params.projectId),
        members: this.workspaceService.getProjectMembers(params.projectId)
      }).pipe(
        map((data) => ({
          ...data,
          epicChildren: data.projectIssues.filter((candidate) => candidate.epicId === data.issue.id),
          epics: data.projectIssues.filter((candidate) => candidate.issueType === 'EPIC' && candidate.id !== params.issueId),
          permissions: resolveProjectPermissions(this.auth.userId(), data.members, {
            workspaceAdmin: this.auth.hasAnyRole('hippoject-admin'),
            projectAdmin: this.auth.hasAnyRole('project-admin'),
            projectManager: this.auth.hasAnyRole('project-manager')
          }),
          projectId: params.projectId,
          issueId: params.issueId
        }))
      )
    ),
    tap(({ issue }) => {
      this.issueForm.title = issue.title;
      this.issueForm.description = issue.description;
      this.issueForm.issueType = issue.issueType;
      this.issueForm.priority = issue.priority;
      this.issueForm.status = issue.status;
      this.issueForm.labels = issue.labels;
      this.issueForm.sprintId = issue.sprintId;
      this.issueForm.epicId = issue.epicId;
      this.issueForm.assigneeId = issue.assigneeId ?? '';
      this.issueLabelsText = issue.labels.join(', ');
    })
  );

  protected addComment(projectId: number, issueId: number): void {
    if (!this.commentBody.trim()) {
      return;
    }

    this.isSavingComment = true;
    this.workspaceService.createComment(projectId, issueId, { body: this.commentBody }).subscribe({
      next: () => {
        this.commentBody = '';
        this.isSavingComment = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingComment = false;
      }
    });
  }

  protected updateIssue(projectId: number, issueId: number): void {
    this.isSavingIssue = true;
    this.workspaceService
      .updateIssue(projectId, issueId, { ...this.issueForm, labels: this.parseLabels(this.issueLabelsText) })
      .subscribe({
      next: () => {
        this.isSavingIssue = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingIssue = false;
      }
    });
  }

  protected deleteIssue(projectId: number, issueId: number): void {
    if (!window.confirm('Vorgang wirklich archivieren?')) {
      return;
    }
    this.isDeletingIssue = true;
    this.workspaceService.deleteIssue(projectId, issueId).subscribe({
      next: (issue) => {
        this.lastDeletedIssue = issue;
        this.isDeletingIssue = false;
      },
      error: () => {
        this.isDeletingIssue = false;
      }
    });
  }

  protected restoreIssue(projectId: number): void {
    if (!this.lastDeletedIssue) {
      return;
    }
    this.workspaceService.restoreIssue(projectId, this.lastDeletedIssue.id).subscribe(() => {
      this.lastDeletedIssue = null;
      this.refresh$.next();
    });
  }

  private parseLabels(value: string): string[] {
    return value
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean);
  }
}
