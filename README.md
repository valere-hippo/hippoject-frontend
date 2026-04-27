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

## Runtime configuration

The app now supports runtime configuration through `public/app-config.js`.

Local defaults are stored in:

- `public/app-config.js`
- `src/environments/environment.ts`

Container deployments render `public/app-config.template.js` at startup with:

- `API_BASE_URL`
- `AUTH_ENABLED`
- `KEYCLOAK_URL`
- `KEYCLOAK_REALM`
- `KEYCLOAK_CLIENT_ID`

Recommended production values:

- frontend: `https://hippoject.hippocloud.de`
- backend API: `https://hippoject-api.hippocloud.de/api`
- Keycloak: `https://auth.hippocloud.de`
- backend realtime socket: `wss://hippoject-api.hippocloud.de/ws/realtime`

## Docker

Build local image:

```bash
docker build -t hippoject-frontend:local .
```

Run local container:

```bash
docker run --rm -p 8080:80 \
  -e API_BASE_URL=http://host.docker.internal:8080/api \
  -e KEYCLOAK_URL=http://host.docker.internal:8081 \
  hippoject-frontend:local
```

## CI/CD

A GitHub Actions workflow is included in `.github/workflows/deploy.yml`.

Expected repository secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PATH` pointing to the checked-out `hippoject-infra` directory on the server

## Notes

- The shell connects to realtime updates over WebSocket.
- If auth is enabled, the frontend attaches a fresh Keycloak token to the realtime socket handshake.
- Runtime config keeps the same image reusable across dev, staging and production.
