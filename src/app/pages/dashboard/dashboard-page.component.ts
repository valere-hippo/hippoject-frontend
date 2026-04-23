import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [AsyncPipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private readonly workspaceService = inject(WorkspaceService);

  protected readonly projects$ = this.workspaceService.getProjects();
  protected readonly issues$ = this.workspaceService.getIssues();
  protected readonly vm$ = combineLatest({
    projects: this.projects$,
    issues: this.issues$
  }).pipe(
    map(({ projects, issues }) => ({
      projects,
      recentIssues: issues.slice(0, 6),
      stats: {
        projects: projects.length,
        open: issues.filter((issue) => issue.status !== 'DONE').length,
        inFlight: issues.filter((issue) => issue.status === 'IN_PROGRESS' || issue.status === 'IN_REVIEW').length,
        critical: issues.filter((issue) => issue.priority === 'CRITICAL').length
      }
    }))
  );
}
