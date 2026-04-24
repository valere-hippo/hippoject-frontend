import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { WorkspaceService } from '../../core/services/workspace.service';
import { projectRoleLabel } from '../../shared/utils/ui-labels';

@Component({
  selector: 'app-settings-page',
  imports: [AsyncPipe],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  protected readonly projectRoleLabel = projectRoleLabel;

  protected readonly directory$ = this.workspaceService.getDirectory();
}
