import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap, tap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { CreateIssueRequest, IssuePriority, IssueStatus } from '../../shared/models/issue.model';
import { UpdateProjectRequest } from '../../shared/models/project.model';

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

  protected readonly issueForm: CreateIssueRequest = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    assigneeId: ''
  };

  protected readonly projectForm: UpdateProjectRequest = {
    name: '',
    description: ''
  };

  protected isSavingIssue = false;
  protected isSavingProject = false;

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
    ),
    tap(({ project }) => {
      this.projectForm.name = project.name;
      this.projectForm.description = project.description;
    })
  );

  protected createIssue(projectId: number): void {
    this.isSavingIssue = true;
    this.workspaceService.createIssue(projectId, this.issueForm).subscribe({
      next: () => {
        this.issueForm.title = '';
        this.issueForm.description = '';
        this.issueForm.priority = 'MEDIUM';
        this.issueForm.status = 'TODO';
        this.issueForm.assigneeId = '';
        this.isSavingIssue = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingIssue = false;
      }
    });
  }

  protected updateProject(projectId: number): void {
    this.isSavingProject = true;
    this.workspaceService.updateProject(projectId, this.projectForm).subscribe({
      next: () => {
        this.isSavingProject = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingProject = false;
      }
    });
  }
}
