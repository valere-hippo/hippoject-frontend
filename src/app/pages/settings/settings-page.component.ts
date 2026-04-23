import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { WorkspaceService } from '../../core/services/workspace.service';

@Component({
  selector: 'app-settings-page',
  imports: [AsyncPipe],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private readonly workspaceService = inject(WorkspaceService);

  protected readonly directory$ = this.workspaceService.getDirectory();
}
