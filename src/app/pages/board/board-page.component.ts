import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { IssueStatus } from '../../shared/models/issue.model';

@Component({
  selector: 'app-board-page',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss'
})
export class BoardPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly route = inject(ActivatedRoute);

  protected readonly columns: { key: IssueStatus; label: string }[] = [
    { key: 'TODO', label: 'To do' },
    { key: 'IN_PROGRESS', label: 'In progress' },
    { key: 'IN_REVIEW', label: 'In review' },
    { key: 'DONE', label: 'Done' }
  ];

  protected readonly issues$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('projectId'))),
    switchMap((projectId) => this.workspaceService.getProjectIssues(projectId))
  );
}
