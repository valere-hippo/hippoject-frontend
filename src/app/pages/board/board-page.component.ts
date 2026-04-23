import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { Issue, IssueStatus } from '../../shared/models/issue.model';

@Component({
  selector: 'app-board-page',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss'
})
export class BoardPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly refresh$ = new Subject<void>();

  protected readonly columns: { key: IssueStatus; label: string }[] = [
    { key: 'TODO', label: 'To do' },
    { key: 'IN_PROGRESS', label: 'In progress' },
    { key: 'IN_REVIEW', label: 'In review' },
    { key: 'DONE', label: 'Done' }
  ];

  protected readonly vm$ = combineLatest({
    projectId: this.route.paramMap.pipe(map((params) => Number(params.get('projectId')))),
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(({ projectId }) =>
      combineLatest({
        project: this.workspaceService.getProject(projectId),
        issues: this.workspaceService.getProjectIssues(projectId)
      }).pipe(map((data) => ({ ...data, projectId })))
    )
  );

  protected moveIssue(projectId: number, issue: Issue, status: IssueStatus): void {
    this.workspaceService
      .updateIssue(projectId, issue.id, {
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        status,
        sprintId: issue.sprintId,
        assigneeId: issue.assigneeId ?? ''
      })
      .subscribe(() => this.refresh$.next());
  }
}
