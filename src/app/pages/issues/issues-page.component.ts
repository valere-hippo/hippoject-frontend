import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WorkspaceService } from '../../core/services/workspace.service';

@Component({
  selector: 'app-issues-page',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss'
})
export class IssuesPageComponent {
  protected readonly issues$ = inject(WorkspaceService).getIssues();
}
