import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';

import { appConfig } from '../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly enabled = appConfig.auth.enabled;
  private readonly keycloak = this.enabled
    ? new Keycloak({
        url: appConfig.auth.url,
        realm: appConfig.auth.realm,
        clientId: appConfig.auth.clientId
      })
    : null;

  readonly ready = signal(false);
  readonly authenticated = signal(!this.enabled);
  readonly userId = signal('local-dev');
  readonly displayName = signal('Valere');
  readonly roleLabel = signal('Administrator');
  readonly initials = signal('VA');
  readonly avatarUrl = signal<string | null>(null);

  async init(): Promise<void> {
    if (!this.keycloak) {
      this.ready.set(true);
      return;
    }

    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`
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

  async login(redirectUri?: string): Promise<void> {
    if (this.keycloak) {
      await this.keycloak.login({ redirectUri: redirectUri ?? window.location.href });
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

  setAvatarUrl(avatarUrl: string | null): void {
    this.avatarUrl.set(avatarUrl);
  }

  private updateProfile(): void {
    const parsed = (this.keycloak?.tokenParsed ?? {}) as Record<string, unknown>;
    const firstName = String(parsed['given_name'] ?? parsed['preferred_username'] ?? 'Hippoject');
    const lastName = String(parsed['family_name'] ?? 'Benutzer');
    const role = this.hasAnyRole('hippoject-admin')
      ? 'Hippoject-Admin'
      : this.hasAnyRole('project-admin')
        ? 'Projektadmin'
        : this.hasAnyRole('project-manager')
          ? 'Projektmanager'
          : this.hasAnyRole('developer')
            ? 'Entwicklung'
            : this.hasAnyRole('reporter')
              ? 'Reporter'
              : 'Benutzer';

    this.userId.set(String(parsed['preferred_username'] ?? parsed['sub'] ?? 'local-dev'));
    this.displayName.set(`${firstName} ${lastName}`.trim());
    this.roleLabel.set(role);
    this.initials.set(`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase());
  }
}
