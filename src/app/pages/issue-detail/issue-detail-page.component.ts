import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap, tap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { IssuePriority, IssueStatus, UpdateIssueRequest } from '../../shared/models/issue.model';

@Component({
  selector: 'app-issue-detail-page',
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './issue-detail-page.component.html',
  styleUrl: './issue-detail-page.component.scss'
})
export class IssueDetailPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly refresh$ = new Subject<void>();

  protected readonly priorities: IssuePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  protected readonly statuses: IssueStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

  protected readonly issueForm: UpdateIssueRequest = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assigneeId: ''
  };

  protected commentBody = '';
  protected isSavingComment = false;
  protected isSavingIssue = false;

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
        comments: this.workspaceService.getComments(params.projectId, params.issueId)
      }).pipe(map((data) => ({ ...data, projectId: params.projectId, issueId: params.issueId })))
    ),
    tap(({ issue }) => {
      this.issueForm.title = issue.title;
      this.issueForm.description = issue.description;
      this.issueForm.priority = issue.priority;
      this.issueForm.status = issue.status;
      this.issueForm.assigneeId = issue.assigneeId ?? '';
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
    this.workspaceService.updateIssue(projectId, issueId, this.issueForm).subscribe({
      next: () => {
        this.isSavingIssue = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingIssue = false;
      }
    });
  }
}
