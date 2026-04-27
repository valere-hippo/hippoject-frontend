#!/bin/sh
set -eu

envsubst '${API_BASE_URL} ${AUTH_ENABLED} ${KEYCLOAK_URL} ${KEYCLOAK_REALM} ${KEYCLOAK_CLIENT_ID}' \
  < /usr/share/nginx/html/app-config.template.js \
  > /usr/share/nginx/html/app-config.js
