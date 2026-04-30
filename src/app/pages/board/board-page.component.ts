import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { Issue, IssueStatus } from '../../shared/models/issue.model';
import { resolveProjectPermissions } from '../../shared/utils/project-permissions';
import { issuePriorityLabel, projectRoleLabel } from '../../shared/utils/ui-labels';

@Component({
  selector: 'app-board-page',
  imports: [AsyncPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss'
})
export class BoardPageComponent {
  private readonly auth = inject(AuthService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly realtimeService = inject(RealtimeService);
  private readonly uiFeedback = inject(UiFeedbackService);
  private readonly route = inject(ActivatedRoute);
  private readonly refresh$ = new Subject<void>();
  protected draggedIssueId: number | null = null;
  protected dragOverColumn: IssueStatus | null = null;
  protected movingIssueId: number | null = null;
  protected readonly selectedStatusByIssueId: Record<number, IssueStatus> = {};
  protected readonly issuePriorityLabel = issuePriorityLabel;
  protected readonly projectRoleLabel = projectRoleLabel;

  constructor() {
    this.realtimeService.events$.subscribe((event) => {
      const payload = event.payload as { projectId?: number } | null;
      if (event.type === 'project-updated' && payload?.projectId === Number(this.route.snapshot.paramMap.get('projectId'))) {
        this.refresh$.next();
      }
    });
  }

  protected readonly columns: { key: IssueStatus; label: string }[] = [
    { key: 'TODO', label: 'Offen' },
    { key: 'IN_PROGRESS', label: 'In Arbeit' },
    { key: 'IN_REVIEW', label: 'In Prüfung' },
    { key: 'DONE', label: 'Erledigt' }
  ];

  protected readonly vm$ = combineLatest({
    projectId: this.route.paramMap.pipe(map((params) => Number(params.get('projectId')))),
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(({ projectId }) =>
      combineLatest({
        project: this.workspaceService.getProject(projectId),
        issues: this.workspaceService.getProjectIssues(projectId),
        members: this.workspaceService.getProjectMembers(projectId)
      }).pipe(
        map((data) => ({
          ...data,
          projectId,
          swimlanes: this.buildSwimlanes(data.issues),
          permissions: resolveProjectPermissions(this.auth.userId(), data.members, {
            workspaceAdmin: this.auth.hasAnyRole('hippoject-admin'),
            projectAdmin: this.auth.hasAnyRole('project-admin'),
            projectManager: this.auth.hasAnyRole('project-manager')
          })
        }))
      )
    )
  );

  private buildSwimlanes(issues: Issue[]) {
    const epicLanes = issues
      .filter((issue) => issue.issueType === 'EPIC')
      .map((epic) => ({
        key: `epic-${epic.id}`,
        title: `${epic.issueKey} · ${epic.title}`,
        issues: issues.filter((candidate) => candidate.id === epic.id || candidate.epicId === epic.id)
      }));

    const standaloneIssues = issues.filter((issue) => issue.issueType !== 'EPIC' && issue.epicId == null);

    return standaloneIssues.length
      ? [...epicLanes, { key: 'ungrouped', title: 'Nicht zugeordnet', issues: standaloneIssues }]
      : epicLanes;
  }

  protected moveIssue(projectId: number, issue: Issue, status: IssueStatus): void {
    this.movingIssueId = issue.id;
    this.workspaceService
      .updateIssue(projectId, issue.id, {
        title: issue.title,
        description: issue.description,
        issueType: issue.issueType,
        priority: issue.priority,
        status,
        labels: issue.labels,
        sprintId: issue.sprintId,
        epicId: issue.epicId,
        assigneeId: issue.assigneeId ?? ''
      })
      .subscribe({
        next: () => {
          this.movingIssueId = null;
          this.uiFeedback.showSuccess(`Der Vorgang wurde nach ${this.columns.find((column) => column.key === status)?.label ?? status} verschoben.`);
          this.refresh$.next();
        },
        error: () => {
          this.movingIssueId = null;
        }
      });
  }

  protected startDrag(issueId: number): void {
    this.draggedIssueId = issueId;
  }

  protected selectedStatus(issue: Issue): IssueStatus {
    return this.selectedStatusByIssueId[issue.id] ?? issue.status;
  }

  protected setSelectedStatus(issueId: number, status: IssueStatus): void {
    this.selectedStatusByIssueId[issueId] = status;
  }

  protected moveIssueToSelected(projectId: number, issue: Issue): void {
    const status = this.selectedStatus(issue);
    if (status !== issue.status) {
      this.moveIssue(projectId, issue, status);
    }
  }

  protected setDragOverColumn(status: IssueStatus | null): void {
    this.dragOverColumn = status;
  }

  protected clearDrag(): void {
    this.draggedIssueId = null;
    this.dragOverColumn = null;
  }

  protected dropOnColumn(projectId: number, issues: Issue[], status: IssueStatus): void {
    const issue = issues.find((candidate) => candidate.id === this.draggedIssueId);
    if (issue && issue.status !== status) {
      this.moveIssue(projectId, issue, status);
    }
    this.clearDrag();
  }
}
