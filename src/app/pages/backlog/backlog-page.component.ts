import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';

@Component({
  selector: 'app-backlog-page',
  imports: [AsyncPipe],
  templateUrl: './backlog-page.component.html',
  styleUrl: './backlog-page.component.scss'
})
export class BacklogPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  protected readonly issues$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('projectId') ?? 'atlas'),
    switchMap((projectId) => this.workspaceService.getProjectIssues(projectId))
  );
}
