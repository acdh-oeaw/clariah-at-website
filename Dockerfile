# syntax=docker/dockerfile:1.12-labs
# labs version is needed for `COPY --exclude`.
# @see https://docs.docker.com/reference/dockerfile/#copy---exclude

# using alpine base image to avoid `sharp` memory leaks.
# @see https://sharp.pixelplumbing.com/install#linux-memory-allocator

# base
FROM node:24-alpine AS base

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch --prod
RUN pnpm install --frozen-lockfile --ignore-scripts --offline --prod

# build
FROM base AS build

RUN pnpm fetch --dev

COPY --chown=node:node ./ ./

# astro assets cache
COPY --chown=node:node ./node_modules/.astro ./node_modules/.astro

ARG PUBLIC_APP_BASE_PATH
ARG PUBLIC_APP_BASE_URL
ARG PUBLIC_BOTS
ARG PUBLIC_GOOGLE_SITE_VERIFICATION
ARG PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
ARG PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
ARG PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER
ARG PUBLIC_KEYSTATIC_MODE
ARG PUBLIC_MATOMO_BASE_URL
ARG PUBLIC_MATOMO_ID
ARG PUBLIC_REDMINE_ID

# disable validation for runtime environment variables
ENV ENV_VALIDATION=public

RUN pnpm install --frozen-lockfile --prefer-offline

ENV NODE_ENV=production

# to mount secrets which need to be available at build time
# @see https://docs.docker.com/build/building/secrets/
RUN --mount=type=secret,id=KEYSTATIC_GITHUB_CLIENT_ID,uid=1000 \
		--mount=type=secret,id=KEYSTATIC_GITHUB_CLIENT_SECRET,uid=1000 \
		--mount=type=secret,id=KEYSTATIC_SECRET,uid=1000 \
			KEYSTATIC_GITHUB_CLIENT_ID=$(cat /run/secrets/KEYSTATIC_GITHUB_CLIENT_ID) \
			KEYSTATIC_GITHUB_CLIENT_SECRET=$(cat /run/secrets/KEYSTATIC_GITHUB_CLIENT_SECRET) \
			KEYSTATIC_SECRET=$(cat /run/secrets/KEYSTATIC_SECRET) \
		pnpm run build

# serve
FROM node:24-alpine AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=base --chown=node:node /app/node_modules ./node_modules
# exclude assets which should have been optimized with `astro:assets`.
COPY --from=build --chown=node:node --exclude=client/assets/content/assets/ /app/dist ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD [ "node", "./server/entry.mjs" ]
