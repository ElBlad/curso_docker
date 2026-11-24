# express-ts-api

Basic REST API using Express + TypeScript + PostgreSQL (`pg`).

## Setup

```bash
npm install
cp .env.example .env   # edit DATABASE_URL and seed flags
npm run dev
```
## ENV

Set `SEED_PRODUCTS` and `SEED_ORDERS` in `.env` to `true` or `false` to
control whether the corresponding sample data is inserted. Order items are
inserted only when their referenced products exist.

The UI sends API requests to the same-origin `/api` path. Vite proxies that
path to the local API during development, and the Compose Nginx server proxies
it to the `api` service. This avoids browser CORS requests in both setups.
`CORS_ORIGIN` remains available for clients that call the API directly
(defaults to `http://localhost:5173`).

The API container applies `src/db/initial-schema.sql` and inserts the sample
products and orders enabled by the `SEED_PRODUCTS` and `SEED_ORDERS`
environment variables before starting the server. Database initialization
runs after PostgreSQL passes its Compose healthcheck and is safe to repeat.

## Endpoints

| Method | Path      | Response                                              |
|--------|-----------|-------------------------------------------------------|
| GET    | /api/health | `200 ok` if DB is reachable, `503` otherwise          |
| POST   | /api/login  | Validate `{ "username", "password" }` against the `users` table; returns the user or `401` |
| GET    | /api/products | Return all products, ordered by name                   |
| GET    | /api/orders | Return all orders with customer names and item quantities, newest first |

Login compares the supplied password directly with the database value and does
not issue a token. The request body must be JSON.

## Scripts

- `npm run dev` – run with hot reload (tsx)
- `npm run build` – compile to `dist/`
- `npm start` – run compiled build
- `npm run typecheck` – type-check only
