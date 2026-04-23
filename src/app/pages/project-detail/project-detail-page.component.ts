import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { CreateIssueRequest, IssuePriority, IssueStatus } from '../../shared/models/issue.model';

@Component({
  selector: 'app-project-detail-page',
  imports: [AsyncPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.scss'
})
export class ProjectDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly refresh$ = new Subject<void>();

  protected readonly priorities: IssuePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  protected readonly statuses: IssueStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

  protected readonly form: CreateIssueRequest = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assigneeId: ''
  };

  protected isSaving = false;

  private readonly projectId$ = this.route.paramMap.pipe(map((params) => Number(params.get('projectId'))));

  protected readonly vm$ = combineLatest({
    projectId: this.projectId$,
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(({ projectId }) =>
      combineLatest({
        project: this.workspaceService.getProject(projectId),
        issues: this.workspaceService.getProjectIssues(projectId)
      })
    )
  );

  protected createIssue(projectId: number): void {
    this.isSaving = true;
    this.workspaceService.createIssue(projectId, this.form).subscribe({
      next: () => {
        this.form.title = '';
        this.form.description = '';
        this.form.priority = 'MEDIUM';
        this.form.status = 'TODO';
        this.form.assigneeId = '';
        this.isSaving = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}
