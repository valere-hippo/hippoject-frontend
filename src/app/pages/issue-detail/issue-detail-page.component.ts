import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';

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

  protected commentBody = '';
  protected isSaving = false;

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
    )
  );

  protected addComment(projectId: number, issueId: number): void {
    if (!this.commentBody.trim()) {
      return;
    }

    this.isSaving = true;
    this.workspaceService.createComment(projectId, issueId, { body: this.commentBody }).subscribe({
      next: () => {
        this.commentBody = '';
        this.isSaving = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}
