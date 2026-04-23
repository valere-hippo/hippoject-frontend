import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { IssueStatus } from '../../shared/models/issue.model';

@Component({
  selector: 'app-board-page',
  imports: [AsyncPipe],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss'
})
export class BoardPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly route = inject(ActivatedRoute);

  protected readonly columns: { key: IssueStatus; label: string }[] = [
    { key: 'todo', label: 'To do' },
    { key: 'in-progress', label: 'In progress' },
    { key: 'in-review', label: 'In review' },
    { key: 'done', label: 'Done' }
  ];

  protected readonly issues$ = this.route.paramMap.pipe(
    map((params) => params.get('projectId') ?? 'atlas'),
    switchMap((projectId) => this.workspaceService.getProjectIssues(projectId))
  );
}
