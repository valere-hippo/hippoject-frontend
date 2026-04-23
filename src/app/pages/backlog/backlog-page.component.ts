import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { Issue } from '../../shared/models/issue.model';
import { CreateSprintRequest } from '../../shared/models/sprint.model';

@Component({
  selector: 'app-backlog-page',
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './backlog-page.component.html',
  styleUrl: './backlog-page.component.scss'
})
export class BacklogPageComponent {
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

  protected readonly vm$ = combineLatest({
    projectId: this.route.paramMap.pipe(map((params) => Number(params.get('projectId')))),
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(({ projectId }) =>
      combineLatest({
        project: this.workspaceService.getProject(projectId),
        issues: this.workspaceService.getProjectIssues(projectId),
        sprints: this.workspaceService.getSprints(projectId)
      }).pipe(map((data) => ({ ...data, projectId })))
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

  protected assignSprint(projectId: number, issue: Issue, sprintId: number | null): void {
    this.workspaceService
      .updateIssue(projectId, issue.id, {
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        status: issue.status,
        sprintId,
        assigneeId: issue.assigneeId ?? ''
      })
      .subscribe(() => this.refresh$.next());
  }
}
