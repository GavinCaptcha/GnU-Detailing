# GnU Detailing — Reservation Site

A simple booking website for GnU Detailing: service selection, scheduling, customer details, and instant confirmation.

## Features

- **Landing page** — hero, services, about, and CTAs
- **4-step booking wizard** — service → schedule → details → confirm
- **Live availability** — blocks already-booked time slots (Sundays closed)
- **Price estimates** — based on service + vehicle size
- **Confirmation page** — unique booking reference (e.g. `GNU-X7K2M9`)
- **Booking storage** — `data/bookings.json` locally, Upstash Redis on Vercel

## Get started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize

| What | Where |
|------|--------|
| Services & prices | `src/lib/services.ts` |
| Business hours | `src/lib/availability.ts` |
| Contact email | `src/components/Footer.tsx` |
| Brand colors | `src/app/globals.css` |

## Deploy on Vercel (bookings + Redis)

Vercel cannot write to `data/bookings.json`. Bookings use **Upstash Redis** when these env vars exist: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_*`).

### Connect your Redis database to the site

**If “Connect” only offers `STORAGE_URL`:** that’s normal. Connect it, then add the **token** yourself (step 3 below). Bookings need **both** URL and token.

1. [vercel.com](https://vercel.com) → **Storage** → open your Redis database.
2. **Connect to Project** → choose your GnU Detailing project → select **`STORAGE_URL`** (or all vars offered) → connect.
3. **Add the token** (if it wasn’t added automatically):
   - On the same Storage page, open **`.env` / Credentials** (or **Quickstart**).
   - Copy the **REST token** (not the `redis://` URL).
   - **Project** → **Settings** → **Environment Variables** → add:
     - Name: `STORAGE_TOKEN` (or `KV_REST_API_TOKEN`)
     - Value: paste the token
     - Environments: Production + Preview
   - Or paste both as `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.
4. **Deployments** → **Redeploy** (required after any env change).

### Verify it works

Open (replace with your domain):

- `https://your-site.vercel.app/api/storage-status` → should be `{"ok":true,"storage":"redis","bookingCount":0}`
- `https://your-site.vercel.app/api/availability` → `{"slots":[]}`

If `storage` is `"none"`, Redis is not connected to that project yet — repeat the steps above and redeploy.

### Local dev with the same Redis (optional)

```bash
npx vercel login
npx vercel link          # select your project, root = GnU-Detailing
npm run env:pull         # writes .env.local from Vercel
npm run verify-storage   # should print Redis OK
npm run dev
```

Without `.env.local`, local bookings still save to `data/bookings.json`.

Optional next steps:

- Email notifications (Resend, SendGrid) on new bookings
- An admin page to view/cancel appointments

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
