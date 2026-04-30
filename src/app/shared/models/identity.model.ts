export type IdentityRealmRole = 'hippoject-admin' | 'project-admin' | 'project-manager' | 'developer' | 'reporter';

export const IDENTITY_REALM_ROLES: IdentityRealmRole[] = [
  'hippoject-admin',
  'project-admin',
  'project-manager',
  'developer',
  'reporter'
];

export interface IdentityUser {
  id: string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  emailVerified: boolean;
  enabled: boolean;
  realmRoles: IdentityRealmRole[];
}

export interface CreateIdentityUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  realmRoles: IdentityRealmRole[];
}

export interface UpdateIdentityUserRolesRequest {
  realmRoles: IdentityRealmRole[];
}
