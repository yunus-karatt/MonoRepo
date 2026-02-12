# Build Stage
FROM node:20-alpine AS base

# Install turbo globally
RUN npm install -g turbo

# Stage 1: Prune
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune web --docker

# Stage 2: Installer
FROM base AS installer
WORKDIR /app

# First copy the lockfile and package.json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN corepack enable && pnpm install

# Build the project
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo build --filter=web...

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy standalone output
COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
# COPY --from=installer /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]
