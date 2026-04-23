import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { WorkspaceService } from '../../core/services/workspace.service';
import {
  CreateSavedIssueFilterRequest,
  Issue,
  IssueFilters,
  IssuePriority,
  IssueStatus,
  IssueType,
  SavedIssueFilter
} from '../../shared/models/issue.model';

@Component({
  selector: 'app-issues-page',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss'
})
export class IssuesPageComponent {
  private readonly workspaceService = inject(WorkspaceService);

  protected readonly statusOptions: Array<IssueStatus | ''> = ['', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  protected readonly priorityOptions: Array<IssuePriority | ''> = ['', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  protected readonly typeOptions: Array<IssueType | ''> = ['', 'STORY', 'TASK', 'BUG', 'EPIC'];

  protected filters: IssueFilters = {
    query: '',
    status: '',
    issueType: '',
    priority: '',
    assigneeId: '',
    label: ''
  };

  protected issues: Issue[] = [];
  protected savedFilters: SavedIssueFilter[] = [];
  protected savedFilterName = '';
  protected isSavingFilter = false;
  protected deletingFilterId: number | null = null;

  constructor() {
    this.loadIssues();
    this.loadSavedFilters();
  }

  protected applyFilters(): void {
    this.loadIssues();
  }

  protected clearFilters(): void {
    this.filters = { query: '', status: '', issueType: '', priority: '', assigneeId: '', label: '' };
    this.loadIssues();
  }

  protected applyQuickFilter(kind: 'active' | 'critical-bugs' | 'epics' | 'review') {
    if (kind === 'active') {
      this.filters = { query: '', status: 'IN_PROGRESS', issueType: '', priority: '', assigneeId: '', label: '' };
    }
    if (kind === 'critical-bugs') {
      this.filters = { query: '', status: '', issueType: 'BUG', priority: 'CRITICAL', assigneeId: '', label: '' };
    }
    if (kind === 'epics') {
      this.filters = { query: '', status: '', issueType: 'EPIC', priority: '', assigneeId: '', label: '' };
    }
    if (kind === 'review') {
      this.filters = { query: '', status: 'IN_REVIEW', issueType: '', priority: '', assigneeId: '', label: '' };
    }
    this.loadIssues();
  }

  protected applySavedFilter(filter: SavedIssueFilter): void {
    this.filters = {
      query: filter.query ?? '',
      projectId: filter.projectId ?? undefined,
      status: filter.status ?? '',
      issueType: filter.issueType ?? '',
      priority: filter.priority ?? '',
      assigneeId: filter.assigneeId ?? '',
      label: filter.label ?? ''
    };
    this.loadIssues();
  }

  protected saveCurrentFilter(): void {
    if (!this.savedFilterName.trim()) {
      return;
    }

    const request: CreateSavedIssueFilterRequest = {
      name: this.savedFilterName.trim(),
      query: this.filters.query?.trim() || undefined,
      projectId: this.filters.projectId ?? null,
      status: this.filters.status || null,
      issueType: this.filters.issueType || null,
      priority: this.filters.priority || null,
      assigneeId: this.filters.assigneeId?.trim() || undefined,
      label: this.filters.label?.trim() || undefined
    };

    this.isSavingFilter = true;
    this.workspaceService.createSavedIssueFilter(request).subscribe({
      next: () => {
        this.savedFilterName = '';
        this.isSavingFilter = false;
        this.loadSavedFilters();
      },
      error: () => {
        this.isSavingFilter = false;
      }
    });
  }

  protected deleteSavedFilter(filterId: number): void {
    if (!window.confirm('Gespeicherten Filter wirklich löschen?')) {
      return;
    }
    this.deletingFilterId = filterId;
    this.workspaceService.deleteSavedIssueFilter(filterId).subscribe({
      next: () => {
        this.deletingFilterId = null;
        this.loadSavedFilters();
      },
      error: () => {
        this.deletingFilterId = null;
      }
    });
  }

  private loadIssues(): void {
    this.workspaceService.getIssues(this.filters).subscribe((issues) => {
      this.issues = issues;
    });
  }

  private loadSavedFilters(): void {
    this.workspaceService.getSavedIssueFilters().subscribe((savedFilters) => {
      this.savedFilters = savedFilters;
    });
  }
}
