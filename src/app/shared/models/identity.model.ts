export interface IdentityUser {
  id: string;
  username: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  emailVerified: boolean;
  enabled: boolean;
}

export interface CreateIdentityUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}
