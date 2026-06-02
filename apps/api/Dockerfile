FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --workspace=@repo/api --include-workspace-root

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN npm run build --workspace=@repo/shared && npm run build --workspace=@repo/api

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app/apps/api

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./

EXPOSE 8000
CMD ["node", "dist/server.js"]
