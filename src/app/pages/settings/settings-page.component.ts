import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest, startWith, switchMap } from 'rxjs';

import { UiFeedbackService } from '../../core/services/ui-feedback.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { CreateIdentityUserRequest, IDENTITY_REALM_ROLES, IdentityRealmRole, IdentityUser } from '../../shared/models/identity.model';
import { identityRealmRoleLabel, projectRoleLabel } from '../../shared/utils/ui-labels';

@Component({
  selector: 'app-settings-page',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private readonly workspaceService = inject(WorkspaceService);
  private readonly uiFeedback = inject(UiFeedbackService);
  private readonly refresh$ = new Subject<void>();
  protected readonly projectRoleLabel = projectRoleLabel;
  protected readonly identityRealmRoleLabel = identityRealmRoleLabel;
  protected readonly realmRoles = IDENTITY_REALM_ROLES;
  protected readonly userRoleDrafts: Record<string, IdentityRealmRole[]> = {};

  protected readonly inviteForm: CreateIdentityUserRequest = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    realmRoles: ['reporter']
  };
  protected isInviting = false;
  protected savingRolesUserId: string | null = null;
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
        this.inviteForm.realmRoles = ['reporter'];
        this.isInviting = false;
        this.inviteSuccess = `Einladungs-E-Mail an ${user.displayName} wurde ausgelöst.`;
        this.uiFeedback.showSuccess(`${user.displayName} wurde eingeladen.`);
        this.refresh$.next();
      },
      error: (error) => {
        this.isInviting = false;
        this.inviteError = error?.error?.message ?? 'Die Einladung konnte nicht versendet werden.';
      }
    });
  }

  protected toggleInviteRole(role: IdentityRealmRole, enabled: boolean): void {
    this.inviteForm.realmRoles = enabled
      ? Array.from(new Set([...this.inviteForm.realmRoles, role]))
      : this.inviteForm.realmRoles.filter((entry) => entry !== role);
  }

  protected roleDraftFor(user: IdentityUser): IdentityRealmRole[] {
    if (!this.userRoleDrafts[user.id]) {
      this.userRoleDrafts[user.id] = [...user.realmRoles];
    }
    return this.userRoleDrafts[user.id];
  }

  protected toggleUserRole(user: IdentityUser, role: IdentityRealmRole, enabled: boolean): void {
    const current = this.roleDraftFor(user);
    this.userRoleDrafts[user.id] = enabled ? Array.from(new Set([...current, role])) : current.filter((entry) => entry !== role);
  }

  protected saveUserRoles(user: IdentityUser): void {
    this.savingRolesUserId = user.id;
    this.workspaceService.updateIdentityUserRoles(user.id, { realmRoles: this.roleDraftFor(user) }).subscribe({
      next: (updatedUser) => {
        this.userRoleDrafts[user.id] = [...updatedUser.realmRoles];
        this.savingRolesUserId = null;
        this.uiFeedback.showSuccess(`Rollen für ${updatedUser.displayName} wurden gespeichert.`);
        this.refresh$.next();
      },
      error: () => {
        this.savingRolesUserId = null;
      }
    });
  }
}
