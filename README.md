# Short Link

A full-stack URL shortener with click analytics. Create short links, track every click with geo and device data, and manage everything from a dashboard.

## Features

- **URL shortening** — Generate compact links with 10-character IDs
- **Click analytics** — Record IP, country, referrer, browser, device, and OS on each redirect
- **Dashboard** — List links, view per-link stats, browse click history, and chart clicks over time
- **Authentication** — Register, log in, and manage links tied to your account via HTTP-only session cookies
- **Guest flow** — Visitors can paste a URL on the landing page and are guided to sign up before the link is saved

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Recharts |
| Backend | Express, Mongoose, Zod |
| Database | MongoDB |
| Monorepo | npm workspaces, Turborepo |
| Shared | `@repo/shared` — types, Zod schemas, API constants |

## Project structure

```
short-link/
├── apps/
│   ├── api/          # Express REST API
│   └── web/          # Next.js frontend
├── packages/
│   └── shared/       # Shared types, schemas, and utilities
├── docker-compose.yml
└── turbo.json
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local instance, Docker, or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and adjust values as needed:

```bash
cp .env.example .env
```

### 3. Start MongoDB

If you don't have MongoDB running locally, start it with Docker:

```bash
docker compose up mongo -d
```

### 4. Run the dev servers

```bash
npm run dev
```

This starts both apps via Turborepo:

- **Web** — [http://localhost:3000](http://localhost:3000)
- **API** — [http://localhost:8000](http://localhost:8000)

In development, Next.js rewrites `/api/*` requests to the Express server at `API_INTERNAL_URL`.

## Environment variables

| Variable | Description |
| --- | --- |
| `MONGO_CONNECTION` | MongoDB connection string |
| `API_PORT` / `PORT` | Express server port (default `8000`) |
| `BASE` | Public base URL for generated short links (no trailing slash) |
| `NEXT_PUBLIC_API_URL` | Browser API base URL — leave empty to use same-origin `/api` |
| `API_INTERNAL_URL` | Dev-only proxy target for Next.js rewrites (default `http://localhost:8000`) |
| `JWT_SECRET` | Secret for signing session tokens |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `COOKIE_NAME` | Session cookie name (default `short_link_session`) |
| `DNS_SERVERS` | Optional comma-separated DNS servers for Atlas SRV resolution |

See [`.env.example`](.env.example) for defaults.

## Docker

Run the full stack (MongoDB, API, and web) with Docker Compose:

```bash
docker compose up --build
```

- Web: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:8000](http://localhost:8000)

Set `JWT_SECRET` in your shell or a `.env` file before starting in production-like mode.

## API

All routes are prefixed with `/api`.

### Health

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Health check |

### Auth

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create an account |
| `POST` | `/auth/login` | No | Log in |
| `POST` | `/auth/logout` | No | Log out |
| `GET` | `/auth/me` | Yes | Get current user |

### Short URLs

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/short` | Yes | List the current user's links (paginated) |
| `POST` | `/short` | Yes | Create a short link (`{ "origUrl": "..." }`) |
| `GET` | `/short/:urlId` | No | Redirect to the original URL and record a click |
| `GET` | `/short/:urlId/clicks` | Yes | List click events for a link (paginated) |

Short links are generated as `{BASE}/api/short/{urlId}`.

## Deployment (Vercel)

The web app is configured for Vercel deployment. In production:

- The Express app is mounted through Next.js at `pages/api/[...slug].ts`
- Do **not** set `API_INTERNAL_URL` on Vercel — localhost resolves to a private IP and breaks rewrites
- Use a cloud MongoDB URI (e.g. Atlas) in `MONGO_CONNECTION` — Vercel cannot reach `127.0.0.1`
- Set `BASE` to your production domain (e.g. `https://your-app.vercel.app`)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all packages and apps |
| `npm run start` | Start all apps in production mode |
| `npm run lint` | Lint all workspaces |
| `npm run clean` | Remove build artifacts and `node_modules` |

## License

Private — not licensed for redistribution.
