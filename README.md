# Short Link — Full-Stack Monolith (Turborepo)

URL shortener monorepo: **Next.js** (`apps/web`) + **Express** (`apps/api`) + **shared types/schemas** (`packages/shared`).

## Structure

```
short-link/
├── apps/
│   ├── web/          # Next.js (App Router)
│   └── api/          # Express + MongoDB
├── packages/
│   └── shared/       # @repo/shared — types, constants, Zod schemas
├── package.json
├── turbo.json
├── .env
├── .env.example
├── vercel.json
├── Dockerfile
└── docker-compose.yml
```

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

## Quick start

```bash
cp .env.example .env
# Edit MONGO_CONNECTION, BASE, ports

npm install
npm run dev
```

- Web: http://localhost:3000  
- API (direct): http://localhost:8000/api/health  
- Browser API calls: `/api/*` (proxied by Next.js — no CORS)

## Scripts (root)

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Turbo dev — web + api + shared watch |
| `npm run build`| Build all packages                   |
| `npm run lint` | Typecheck / lint workspaces          |
| `npm run start`| Production start (after build)       |

## Environment

| Variable              | Description                                      |
|-----------------------|--------------------------------------------------|
| `MONGO_CONNECTION`    | MongoDB URI                                      |
| `API_PORT` / `PORT`   | Express port (default `8000`)                    |
| `BASE`                | Public origin for short links (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_API_URL` | Leave empty to use same-origin `/api`            |
| `API_INTERNAL_URL`    | **Dev only** — rewrite target (default `http://localhost:8000`). Do not set on Vercel. |
| `JWT_SECRET`          | JWT signing secret                               |

## API

Standard response shape (`@repo/shared`):

```json
{ "success": true, "data": {} }
{ "success": false, "error": { "message": "", "code": "" } }
```

| Method | Path              | Description        |
|--------|-------------------|--------------------|
| GET    | `/api/health`     | Health check       |
| POST   | `/api/short`      | `{ "origUrl": "..." }` |
| GET    | `/api/short/:id`  | Redirect           |

## Shared package

```ts
import { shortenUrlSchema, API_ROUTES, successResponse } from "@repo/shared";
```

## Deployment

### Vercel (primary)

1. Connect the repo and set **Root Directory** to `apps/web` (recommended).  
   `apps/web/vercel.json` runs install/build from the monorepo root.
2. Add environment variables in the Vercel dashboard:
   - `MONGO_CONNECTION` — MongoDB Atlas URI (not `127.0.0.1`)
   - `BASE` — `https://your-app.vercel.app` (no trailing slash)
   - `JWT_SECRET` — strong random secret
   - **Do not** set `API_INTERNAL_URL` (dev-only rewrite to localhost)
3. Production API is served by Next.js at `pages/api/[...slug].ts` (Express embedded). No rewrite to `localhost:8000`.

After deploy, verify `https://your-app.vercel.app/api/health` returns `{ "success": true, ... }`.

### Docker

```bash
docker compose up --build
```

### VPS / single container

```bash
docker build -t short-link .
docker run -p 3000:3000 -p 8000:8000 --env-file .env short-link
```

---

## Migration from `backend/` + `frontend/`

### 1. Copy environment

```bash
cp backend/.env .env
```

Update values:

- `BASE=http://localhost:3000` (was often `http://localhost:8000` — short links should use the Next.js origin)
- Add `API_INTERNAL_URL=http://localhost:8000`
- Add `API_PORT=8000`

### 2. Install monorepo

```bash
npm install
npm run build
npm run dev
```

### 3. Verify

- Open http://localhost:3000 — shorten a URL
- `GET http://localhost:3000/api/health` → `{ "success": true, ... }`
- Open generated short link → redirects to original URL

### 4. Remove legacy folders (after verification)

```bash
rm -rf backend frontend
```

### File mapping

| Legacy                    | New                                      |
|---------------------------|------------------------------------------|
| `backend/app.js`          | `apps/api/src/app.ts`, `server.ts`       |
| `backend/controller/`     | `apps/api/src/controllers/`              |
| `backend/routes/`         | `apps/api/src/routes/`                   |
| `backend/models/`         | `apps/api/src/models/`                   |
| `frontend/app/`           | `apps/web/src/app/`                      |
| `frontend/public/`        | `apps/web/public/`                       |
| (new)                     | `packages/shared/`                       |
| (new)                     | `apps/web/src/lib/api-client.ts`         |

### Route changes

Legacy routes were `/short` (no `/api` prefix). All API routes are now under `/api/short` with standardized JSON responses.

---

## Auth foundation

Prepared but not fully implemented:

- `apps/api/src/middleware/auth.ts` — JWT + cookie extraction
- `apps/api/src/config/auth.ts` — cookie/JWT settings
- `apps/api/src/middleware/session.ts` — session placeholder

Implement login/register when ready and use `authenticate({ required: true })` on protected routes.