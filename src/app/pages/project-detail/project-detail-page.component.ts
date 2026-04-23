import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';

@Component({
  selector: 'app-project-detail-page',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.scss'
})
export class ProjectDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly workspaceService = inject(WorkspaceService);

  private readonly projectId$ = this.route.paramMap.pipe(map((params) => params.get('projectId') ?? 'atlas'));

  protected readonly vm$ = this.projectId$.pipe(
    switchMap((projectId) =>
      combineLatest({
        project: this.workspaceService.getProject(projectId),
        issues: this.workspaceService.getProjectIssues(projectId),
        sprint: this.workspaceService.getProjectSprint(projectId)
      })
    )
  );
}
