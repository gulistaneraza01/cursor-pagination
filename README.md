# Cursor Pagination

A cursor-based pagination demo: an Express + Prisma API paginating a Postgres `User` table, and a Next.js UI that infinite-scrolls through it.

![Demo](./media/demo.gif)

## Architecture

Turborepo monorepo with two apps that talk to each other over HTTP:

```
apps/
  server/   Express API (Bun runtime, Prisma + Postgres)
  web/      Next.js UI (Tailwind, shadcn/ui, axios)
```

```
Browser
  │  scroll
  ▼
apps/web (Next.js, :3000)
  │  GET /v1/users?cursor=&limit=&sortBy=&order=
  │  (proxied by a next.config.js rewrite)
  ▼
apps/server (Express, :8000)
  routes/user.routes.ts
    │  paginationMiddleware  → parses & validates cursor, limit, sortBy, order
    ▼
  controller/user.controller.ts   → request/response shape
    ▼
  services/user.service.ts        → Prisma query, builds { data, nextCursor }
    ▼
  Postgres (Neon), via Prisma
```

- **Pagination middleware** (`apps/server/src/middleware/pagination.middleware.ts`) is reusable across any list route: it validates `sortBy` against a per-route whitelist and defaults to `create_at desc` when not provided.
- **Cursor stability**: results are ordered by `[{ create_at: order }, { id: order }]` so pagination stays stable even when many rows share the same timestamp (e.g. after a bulk seed).
- **UI infinite scroll** (`apps/web/components/users/UserList.tsx`) uses an `IntersectionObserver` scoped to the scrollable list container (not the page), recreated on every page load so it keeps firing as content grows, with enough `rootMargin` lead time to prefetch before you hit the bottom.

## Getting started

```sh
bun install
```

Server needs a Postgres connection string in `apps/server/.env`:

```
DATABASE_URL="postgresql://..."
PORT=8000
```

Run both apps:

```sh
cd apps/server && bun run dev   # http://localhost:8000
cd apps/web    && bun run dev   # http://localhost:3000
```

Seed 1,000 demo users:

```sh
cd apps/server
bun run prisma/seed-users-csv.ts   # generates prisma/users.csv
curl -X POST http://localhost:8000/v1/seed/seed-users
```

## API

`GET /v1/users`

| Query param | Default      | Notes                                              |
|-------------|--------------|-----------------------------------------------------|
| `cursor`    | —            | Last row's `id` from the previous page              |
| `limit`     | `20`         | Capped at `100`                                     |
| `sortBy`    | `create_at`  | Whitelisted per route (`id`, `name`, `email`, `create_at`, `modified_at`) |
| `order`     | `desc`       | `asc` or `desc`                                     |

```json
{
  "data": [{ "id": "...", "name": "...", "email": "...", "create_at": "..." }],
  "nextCursor": "01535982-4002-4671-8dfd-f46e4515f9cf"
}
```

`nextCursor: null` means you've reached the end.
