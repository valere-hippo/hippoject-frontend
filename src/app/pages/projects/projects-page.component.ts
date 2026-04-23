import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, startWith, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { CreateProjectRequest } from '../../shared/models/project.model';

@Component({
  selector: 'app-projects-page',
  imports: [AsyncPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly refresh$ = new Subject<void>();

  protected readonly projects$ = this.refresh$.pipe(
    startWith(void 0),
    switchMap(() => this.workspaceService.getProjects())
  );

  protected readonly form: CreateProjectRequest = {
    key: '',
    name: '',
    description: ''
  };

  protected isSaving = false;

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
}
