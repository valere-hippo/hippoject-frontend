import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { issueStatusLabel } from '../../shared/utils/ui-labels';

@Component({
  selector: 'app-dashboard-page',
  imports: [AsyncPipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  protected readonly issueStatusLabel = issueStatusLabel;

  protected readonly vm$ = combineLatest({
    projects: this.workspaceService.getProjects(),
    issues: this.workspaceService.getIssues(),
    summary: this.workspaceService.getDashboardSummary()
  }).pipe(
    map(({ projects, issues, summary }) => ({
      projects,
      summary,
      recentIssues: issues.slice(0, 6),
      epicLinked: issues.filter((issue) => issue.epicId != null).length
    }))
  );
}
