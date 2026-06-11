ARG NODE_VERSION=25.2.1
ARG PORT=3000

# ==========================================
# 1. Build Stage
# ==========================================
FROM node:${NODE_VERSION}-slim AS theses-front-image-build

WORKDIR /app

# Mise en cache optimale des dépendances
COPY --link package.json package-lock.json ./
# npm ci garantit une installation exacte et reproductible basée sur le package-lock
RUN npm ci

# Copie du reste des sources
COPY --link . .

# Fichier d'environnement par défaut pour permettre le build
COPY ./docker/nuxt_env_placeholder .env

ARG NUXT_APP_API
ARG NUXT_APP_APIREF
ARG NUXT_IS_MAINTENANCE
ARG NUXT_MAINTENANCE_MESSAGE

# Build de Nuxt (Nitro générera le dossier .output autonome)
RUN npm run build


# ==========================================
# 2. Run Stage (Production)
# ==========================================
FROM node:${NODE_VERSION}-slim AS theses-front-image-run

ARG PORT
ENV PORT=$PORT
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

ENV NUXT_APP_API=$NUXT_APP_API
ENV NUXT_APP_APIREF=$NUXT_APP_APIREF
ENV NUXT_IS_MAINTENANCE=$NUXT_IS_MAINTENANCE
ENV NUXT_MAINTENANCE_MESSAGE=$NUXT_MAINTENANCE_MESSAGE

WORKDIR /app

# Sécurité : On s'assure que l'utilisateur non-root "node" a les droits sur le dossier
RUN chown node:node /app

# Bascule sur l'utilisateur sécurisé (bonne pratique Docker)
USER node

# Récupération de l'output Nitro et de l'agent avec les bons droits
COPY --chown=node:node --from=theses-front-image-build /app/.output ./.output

EXPOSE $PORT

# Démarrage
CMD [ "node", "./.output/server/index.mjs" ]