import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';

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
  protected readonly currentSprint$ = this.workspaceService.getProjectSprint('atlas');
  protected readonly stats$ = this.workspaceService.getIssues().pipe(
    map((issues) => ({
      open: issues.filter((issue) => issue.status !== 'done').length,
      shipping: issues.filter((issue) => issue.status === 'in-progress' || issue.status === 'in-review').length,
      critical: issues.filter((issue) => issue.priority === 'critical').length
    }))
  );
}
