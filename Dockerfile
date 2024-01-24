ARG NODE_VERSION=18.14.2
ARG PORT=3000

# Build
FROM node:${NODE_VERSION}-slim as theses-front-image-build
ENV NODE_ENV=production
WORKDIR /src/
COPY ./docker/nuxt_env_placeholder .env
# mise en cache docker des dépendances
COPY --link package.json package-lock.json /src/
RUN npm install --production=false
# copie des sources et compilation
COPY --link . /src/
RUN npm run build



# Run
FROM node:${NODE_VERSION}-slim as theses-front-image-run
ENV PORT=$PORT
ENV NODE_OPTIONS=--max-old-space-size=8192
WORKDIR /src/
COPY --from=theses-front-image-build /src/.output/ /src/.output/
CMD [ "node", "/src/.output/server/index.mjs" ]
EXPOSE $PORT
