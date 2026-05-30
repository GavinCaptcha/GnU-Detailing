# GnU Detailing — Reservation Site

A simple booking website for GnU Detailing: service selection, scheduling, customer details, and instant confirmation.

## Features

- **Landing page** — hero, services, about, and CTAs
- **4-step booking wizard** — service → schedule → details → confirm
- **Live availability** — blocks already-booked time slots (Sundays closed)
- **Price estimates** — based on service + vehicle size
- **Confirmation page** — unique booking reference (e.g. `GNU-X7K2M9`)
- **Booking storage** — saved to `data/bookings.json` on the server

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

## Deploy

Works on [Vercel](https://vercel.com), Netlify, or any Node host. For production, consider:

- A database (Supabase, PlanetScale) instead of `bookings.json`
- Email notifications (Resend, SendGrid) on new bookings
- An admin page to view/cancel appointments

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
