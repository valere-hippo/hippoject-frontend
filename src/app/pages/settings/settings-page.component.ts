import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest, startWith, switchMap } from 'rxjs';

import { WorkspaceService } from '../../core/services/workspace.service';
import { CreateIdentityUserRequest } from '../../shared/models/identity.model';
import { projectRoleLabel } from '../../shared/utils/ui-labels';

@Component({
  selector: 'app-settings-page',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly refresh$ = new Subject<void>();
  protected readonly projectRoleLabel = projectRoleLabel;

  protected readonly inviteForm: CreateIdentityUserRequest = {
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  };
  protected isInviting = false;
  protected inviteSuccess = '';
  protected inviteError = '';

  protected readonly vm$ = combineLatest({
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(() =>
      combineLatest({
        directory: this.workspaceService.getDirectory(),
        users: this.workspaceService.getIdentityUsers()
      })
    )
  );

  protected inviteUser(): void {
    this.isInviting = true;
    this.inviteSuccess = '';
    this.inviteError = '';

    this.workspaceService.inviteIdentityUser({ ...this.inviteForm }).subscribe({
      next: (user) => {
        this.inviteForm.username = '';
        this.inviteForm.email = '';
        this.inviteForm.firstName = '';
        this.inviteForm.lastName = '';
        this.isInviting = false;
        this.inviteSuccess = `Einladungs-E-Mail an ${user.displayName} wurde ausgelöst.`;
        this.refresh$.next();
      },
      error: (error) => {
        this.isInviting = false;
        this.inviteError = error?.error?.message ?? 'Die Einladung konnte nicht versendet werden.';
      }
    });
  }
}
