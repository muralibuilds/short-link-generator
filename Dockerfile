# Production monolith image — Next.js + Express API
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/turbo.json ./

ENV API_INTERNAL_URL=http://127.0.0.1:8000
ENV PORT=3000
ENV API_PORT=8000

EXPOSE 3000 8000

CMD ["sh", "-c", "node apps/api/dist/server.js & exec npm run start --workspace=@repo/web"]
