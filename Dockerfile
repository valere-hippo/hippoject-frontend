FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/40-render-app-config.sh /docker-entrypoint.d/40-render-app-config.sh
COPY --from=build /app/dist/hippoject-frontend/browser /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.d/40-render-app-config.sh

ENV API_BASE_URL=https://hippoject-api.hipposideros-cloud.de/api
ENV AUTH_ENABLED=true
ENV KEYCLOAK_URL=https://auth.hipposideros-cloud.de
ENV KEYCLOAK_REALM=hippoject
ENV KEYCLOAK_CLIENT_ID=hippoject-frontend

EXPOSE 80
