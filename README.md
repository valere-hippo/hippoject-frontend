# Hippoject Frontend

Angular frontend for Hippoject.

## Current scope

The UI currently includes:

- dashboard KPIs
- projects overview and project detail pages
- board with desktop drag-and-drop and touch-friendlier quick move controls
- backlog and sprint lifecycle flows
- issue navigator with saved filters and archived issue view
- issue detail editing, comments, epic progress, and restore flow
- notification inbox
- team directory and assignee pickers
- Keycloak login flow
- realtime refresh over WebSocket

## Local development

Install dependencies:

```bash
npm install --include=dev
```

Run the dev server:

```bash
npm start
```

Build:

```bash
npm run build
```

## Environment

The app expects `src/environments/environment.ts` and `environment.prod.ts` values for:

- `apiBaseUrl`
- Keycloak `url`
- Keycloak `realm`
- Keycloak `clientId`

Current local defaults are aligned to:

- frontend: `http://localhost:4200`
- backend API: `http://localhost:8080/api`
- Keycloak: `http://localhost:8081`
- backend realtime socket: `/ws/realtime`

## Notes

- The shell connects to realtime updates over WebSocket.
- If auth is enabled, the frontend attaches a fresh Keycloak token to the realtime socket handshake.
- Angular production builds were used throughout this project as the main frontend sanity check.
