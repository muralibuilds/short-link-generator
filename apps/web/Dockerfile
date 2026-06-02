FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --workspace=@repo/web --include-workspace-root

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN npm run build --workspace=@repo/shared && npm run build --workspace=@repo/web

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app/apps/web

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/apps/web/next.config.ts ./

EXPOSE 3000
CMD ["npm", "start"]
