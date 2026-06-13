# Deployment Guide

Backend (Django/GraphQL) → **Railway**. Frontends (`admin-shop`, `tg-shop`) → **Vercel**.

This project no longer depends on Google Cloud. All configuration is read from
the process environment: Railway and Vercel inject the variables directly — no
`.env` file or Secret Manager in deployment.

## Deploy order (resolves the URL chicken-and-egg)

1. **Railway**: deploy the backend first. Add Postgres, set env vars, get the public URL.
2. **Vercel**: deploy both frontends, pointing `NEXT_PUBLIC_API_URL` at the Railway URL.
3. **Railway**: come back and set `FRONTEND_CLIENT_URL` / `ADMIN_CLIENT_URL` to the
   two Vercel URLs (needed for CORS + CSRF), then redeploy.

Stage 1 runs on the `development` branch. Once verified, merge to `main` and swap
in production secrets/bots.

---

## Prerequisites: 3 Telegram bots

Create three bots with [@BotFather](https://t.me/botfather) and note each token + username:

| Bot | Token env var | Username env var |
|-----|---------------|------------------|
| Shop (customer) | `TELEGRAM_SHOP_TOKEN` | `TELEGRAM_SHOP_BOT_USERNAME` |
| Support | `TELEGRAM_SUPPORT_TOKEN` | `TELEGRAM_SUPPORT_BOT_USERNAME` |
| Admin | `TELEGRAM_ADMIN_BOT_TOKEN` | — |

Also grab your own numeric Telegram id (via [@userinfobot](https://t.me/userinfobot)) for `SUPERUSER_TELEGRAM_ID`.

## Generate secrets

```bash
openssl rand -base64 48   # SECRET_KEY
openssl rand -base64 32   # JWT_SECRET_KEY
openssl rand 32 | base64  # AES_SECRET_KEY  (must decode to 32 bytes)
openssl rand 16 | base64  # AES_IV          (must decode to 16 bytes)
openssl rand -base64 32   # NEXTAUTH_SECRET (per Vercel app)
```

---

## 1. Backend → Railway

- **New Project → Deploy from GitHub repo**, branch `development`.
- **Service → Settings → Root Directory:** `api-shop/shop` (the Dockerfile there is used automatically).
- **Add a Postgres database** to the project. Railway exposes `DATABASE_URL` to the
  service automatically — do **not** set it manually.
- The container runs `migrate` + `collectstatic` on start, then gunicorn on `$PORT`.
  Static files are served by WhiteNoise. `RAILWAY_PUBLIC_DOMAIN` is injected
  automatically and used for `ALLOWED_HOSTS`/CSRF.

### Backend environment variables (Railway)

| Variable | Value |
|----------|-------|
| `DEBUG` | `False` |
| `SECRET_KEY` | generated |
| `JWT_SECRET_KEY` | generated |
| `AES_SECRET_KEY` | generated (base64, 32 bytes) |
| `AES_IV` | generated (base64, 16 bytes) |
| `SERVICE_URL` | the Railway public URL, e.g. `https://<svc>.up.railway.app` |
| `FRONTEND_CLIENT_URL` | the tg-shop Vercel URL (set in step 3) |
| `ADMIN_CLIENT_URL` | the admin-shop Vercel URL (set in step 3) |
| `TELEGRAM_API_URL` | `https://api.telegram.org` |
| `TELEGRAM_SHOP_BOT_USERNAME` | shop bot username |
| `TELEGRAM_SHOP_TOKEN` | shop bot token |
| `TELEGRAM_SUPPORT_BOT_USERNAME` | support bot username |
| `TELEGRAM_SUPPORT_TOKEN` | support bot token |
| `TELEGRAM_ADMIN_BOT_TOKEN` | admin bot token |
| `TELEGRAM_WEB_APP_URL` | the tg-shop Vercel URL |
| `TELEGRAM_ADMIN_CHAT_ID` | admin chat id |
| `TELEGRAM_SUPPORT_CHAT_ID` | support chat id |
| `SUPERUSER_TELEGRAM_ID` | your Telegram numeric id |
| `TELEGRAM_PAYMENT_RETURN_URL` | the tg-shop Vercel URL |

> Note: `DATABASE_URL` is provided by the Railway Postgres plugin — leave it unset.
>
> Wallet Pay credentials are **not** environment variables — they're entered per
> store in the admin dashboard and stored encrypted in the database (decrypted at
> runtime with `AES_SECRET_KEY`/`AES_IV`).

---

## 2. Frontends → Vercel (two projects, same repo)

For **each** app create a separate Vercel project from the repo (branch `development`):

| | admin-shop | tg-shop |
|--|-----------|---------|
| Root Directory | `apps/admin-shop` | `apps/tg-shop` |
| Framework preset | Next.js | Next.js |

Vercel auto-detects the Yarn workspaces monorepo and installs from the repo root.
The shared `@ditch/lib` package is consumed from source (via `transpilePackages`),
so **no separate build step is required**.

### admin-shop env vars (Vercel)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://<railway-url>/graphql/` |
| `NEXTAUTH_URL` | the admin-shop Vercel URL |
| `NEXTAUTH_SECRET` | generated |
| `NEXT_PUBLIC_BOT_USERNAME` | shop bot username |
| `EDGE_STORE_ACCESS_KEY` | from your EdgeStore project |
| `EDGE_STORE_SECRET_KEY` | from your EdgeStore project |

### tg-shop env vars (Vercel)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://<railway-url>/graphql/` |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | optional (address autocomplete) |

> Image uploads use **EdgeStore** (cloud-agnostic). Create a project at
> [edgestore.dev](https://edgestore.dev) for the two `EDGE_STORE_*` keys.

---

## 3. Wire CORS/CSRF back to the frontends

After the Vercel URLs exist, set `FRONTEND_CLIENT_URL` and `ADMIN_CLIENT_URL` on the
Railway service and redeploy. These drive `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.

## 4. Verify

- `https://<railway-url>/graphql/` loads GraphiQL.
- `https://<railway-url>/admin/` loads with styling (confirms WhiteNoise static).
- Admin dashboard signs in via Telegram (requires the real shop bot token + username).

## Notes / known limitations

- The two model `FileField`s (store logos, marketing files) use the container's local
  disk, which is **ephemeral on Railway** (lost on redeploy). Product images are
  unaffected (EdgeStore). Move these to S3/R2 later if needed.
- `ALLOWED_HOSTS` derives from `RAILWAY_PUBLIC_DOMAIN` + `SERVICE_URL`; a custom domain
  must be added to `SERVICE_URL` (or Railway domain settings).
