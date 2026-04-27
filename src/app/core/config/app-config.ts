import { environment } from '../../../environments/environment';

type RuntimeAuthConfig = {
  enabled?: boolean;
  url?: string;
  realm?: string;
  clientId?: string;
};

type RuntimeAppConfig = {
  apiBaseUrl?: string;
  auth?: RuntimeAuthConfig;
};

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeAppConfig;
  }
}

const runtimeConfig = typeof window !== 'undefined' ? window.__APP_CONFIG__ : undefined;

export const appConfig = {
  production: environment.production,
  apiBaseUrl: runtimeConfig?.apiBaseUrl ?? environment.apiBaseUrl,
  auth: {
    enabled: runtimeConfig?.auth?.enabled ?? environment.auth.enabled,
    url: runtimeConfig?.auth?.url ?? environment.auth.url,
    realm: runtimeConfig?.auth?.realm ?? environment.auth.realm,
    clientId: runtimeConfig?.auth?.clientId ?? environment.auth.clientId
  }
};
