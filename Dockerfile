ARG NODE_VERSION=26
ARG PORT=3000

# ==========================================
# 1. Build Stage
# ==========================================
FROM node:${NODE_VERSION}-slim AS theses-front-image-build

WORKDIR /app

# Mise en cache optimale des dépendances
COPY --link package.json package-lock.json ./

# Upgrade de npm
RUN npm install -g npm@latest

# npm ci garantit une installation exacte et reproductible basée sur le package-lock
RUN npm ci

# Copie du reste des sources
COPY --link . .

# Build de Nuxt (Nitro générera le dossier .output autonome)
RUN npm run build

# Supprime les devDependencies pour n'avoir que les dépendances de production dans node_modules
RUN npm prune --omit=dev


# ==========================================
# 2. Run Stage (Production)
# ==========================================
FROM node:${NODE_VERSION}-slim AS theses-front-image-run

ARG PORT
ENV PORT=$PORT
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR /app

# Sécurité : On s'assure que l'utilisateur non-root "node" a les droits sur le dossier
RUN chown node:node /app

# Bascule sur l'utilisateur sécurisé (bonne pratique Docker)
USER node

# Récupération de l'output Nitro, des dépendances de production et de l'agent avec les bons droits
COPY --chown=node:node --from=theses-front-image-build /app/.output ./.output
COPY --chown=node:node --from=theses-front-image-build /app/node_modules ./node_modules
COPY --chown=node:node --from=theses-front-image-build /app/instrumentation.mjs ./instrumentation.mjs

EXPOSE $PORT

# Démarrage
CMD [ "node", "--import", "./instrumentation.mjs", "./.output/server/index.mjs" ]