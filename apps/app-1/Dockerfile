# Build Stage
FROM node:20-alpine AS base

# Install turbo globally
RUN npm install -g turbo

# Stage 1: Prune
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune app-1 --docker

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
RUN pnpm turbo build --filter=app-1...

# Stage 3: Runner
FROM nginx:stable-alpine AS runner

# Copy static files from builder
COPY --from=installer /app/apps/app-1/dist /usr/share/nginx/html

# Optional: Add custom nginx config if needed
# COPY apps/app-1/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
