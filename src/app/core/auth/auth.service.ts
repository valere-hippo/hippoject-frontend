import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly enabled = environment.auth.enabled;
  private readonly keycloak = this.enabled
    ? new Keycloak({
        url: environment.auth.url,
        realm: environment.auth.realm,
        clientId: environment.auth.clientId
      })
    : null;

  readonly ready = signal(false);
  readonly authenticated = signal(!this.enabled);
  readonly displayName = signal('Valere');
  readonly roleLabel = signal('Administrator');
  readonly initials = signal('VA');

  async init(): Promise<void> {
    if (!this.keycloak) {
      this.ready.set(true);
      return;
    }

    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false
    });

    this.authenticated.set(authenticated);
    this.updateProfile();
    this.ready.set(true);
  }

  async getToken(): Promise<string | null> {
    if (!this.keycloak) {
      return null;
    }

    await this.keycloak.updateToken(30);
    this.updateProfile();
    return this.keycloak.token ?? null;
  }

  async login(): Promise<void> {
    if (this.keycloak) {
      await this.keycloak.login();
    }
  }

  async logout(): Promise<void> {
    if (this.keycloak) {
      await this.keycloak.logout({ redirectUri: window.location.origin });
    }
  }

  hasAnyRole(...roles: string[]): boolean {
    if (!this.keycloak || !this.keycloak.tokenParsed) {
      return !this.enabled;
    }

    const realmAccess = (this.keycloak.tokenParsed as Record<string, unknown>)['realm_access'] as
      | { roles?: string[] }
      | undefined;
    const userRoles = realmAccess?.roles ?? [];
    return roles.some((role) => userRoles.includes(role));
  }

  private updateProfile(): void {
    const parsed = (this.keycloak?.tokenParsed ?? {}) as Record<string, unknown>;
    const firstName = String(parsed['given_name'] ?? parsed['preferred_username'] ?? 'Hippoject');
    const lastName = String(parsed['family_name'] ?? 'User');
    const role = this.hasAnyRole('hippoject-admin')
      ? 'Hippoject Admin'
      : this.hasAnyRole('project-admin')
        ? 'Project Admin'
        : this.hasAnyRole('project-manager')
          ? 'Project Manager'
          : this.hasAnyRole('developer')
            ? 'Developer'
            : this.hasAnyRole('reporter')
              ? 'Reporter'
              : 'User';

    this.displayName.set(`${firstName} ${lastName}`.trim());
    this.roleLabel.set(role);
    this.initials.set(`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase());
  }
}
