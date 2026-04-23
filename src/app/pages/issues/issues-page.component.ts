import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { WorkspaceService } from '../../core/services/workspace.service';
import { Issue, IssueFilters, IssueStatus, IssueType } from '../../shared/models/issue.model';

@Component({
  selector: 'app-issues-page',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss'
})
export class IssuesPageComponent {
  private readonly workspaceService = inject(WorkspaceService);

  protected readonly statusOptions: Array<IssueStatus | ''> = ['', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  protected readonly typeOptions: Array<IssueType | ''> = ['', 'STORY', 'TASK', 'BUG', 'EPIC'];

  protected filters: IssueFilters = {
    query: '',
    status: '',
    issueType: '',
    label: ''
  };

  protected issues: Issue[] = [];

  constructor() {
    this.loadIssues();
  }

  protected applyFilters(): void {
    this.loadIssues();
  }

  protected clearFilters(): void {
    this.filters = { query: '', status: '', issueType: '', label: '' };
    this.loadIssues();
  }

  private loadIssues(): void {
    this.workspaceService.getIssues(this.filters).subscribe((issues) => {
      this.issues = issues;
    });
  }
}
