import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WorkspaceService } from '../../core/services/workspace.service';

@Component({
  selector: 'app-projects-page',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent {
  protected readonly projects$ = inject(WorkspaceService).getProjects();
}
