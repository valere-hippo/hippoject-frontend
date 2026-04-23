import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, startWith, switchMap } from 'rxjs';

import { RealtimeService } from '../../core/services/realtime.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { CreateProjectRequest } from '../../shared/models/project.model';

@Component({
  selector: 'app-projects-page',
  imports: [AsyncPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent {
  private readonly realtimeService = inject(RealtimeService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly refresh$ = new Subject<void>();
  protected includeArchived = false;
  protected archivingProjectId: number | null = null;
  protected restoringProjectId: number | null = null;

  protected readonly projects$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.workspaceService.getProjects(this.includeArchived))
  );

  protected readonly form: CreateProjectRequest = {
    key: '',
    name: '',
    description: ''
  };

  protected isSaving = false;

  constructor() {
    this.realtimeService.events$.subscribe((event) => {
      if (event.type === 'project-updated') {
        this.refresh$.next();
      }
    });
  }

  protected createProject(): void {
    this.isSaving = true;
    this.workspaceService.createProject(this.form).subscribe({
      next: () => {
        this.form.key = '';
        this.form.name = '';
        this.form.description = '';
        this.isSaving = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  protected toggleArchived(): void {
    this.refresh$.next();
  }

  protected archiveProject(projectId: number): void {
    if (!window.confirm('Projekt wirklich archivieren?')) {
      return;
    }
    this.archivingProjectId = projectId;
    this.workspaceService.archiveProject(projectId).subscribe({
      next: () => {
        this.archivingProjectId = null;
        this.refresh$.next();
      },
      error: () => {
        this.archivingProjectId = null;
      }
    });
  }

  protected restoreProject(projectId: number): void {
    this.restoringProjectId = projectId;
    this.workspaceService.restoreProject(projectId).subscribe({
      next: () => {
        this.restoringProjectId = null;
        this.refresh$.next();
      },
      error: () => {
        this.restoringProjectId = null;
      }
    });
  }
}
