# Cloudflare Migration

Date: 2026-04-30

## Current Target

Barber Brothers is now targeted for Cloudflare Pages with Cloudflare Pages Functions and Cloudflare D1.

## Active Runtime

- Static website output: `out`
- Hosting: Cloudflare Pages project `barber-brothers`
- Domain: `barberbrothers.style`
- API runtime: Cloudflare Pages Functions under `functions/`
- Database: Cloudflare D1 database `barber-brothers-db`
- D1 database ID: `1fd74c5a-6bf8-4356-aadb-422c716a4186`

## Database Tables

- `bookings`: stores confirmed and soft-deleted bookings.
- `slot_locks`: stores active slot locks. `slot_key` is unique and prevents double booking for the same barber/date/time.

## Staff Access

Staff login is handled by a Cloudflare Pages Function using an HttpOnly signed session cookie.

Required Cloudflare variables/secrets:

- `STAFF_LOGIN_EMAIL`
- `STAFF_LOGIN_PASSWORD`
- `STAFF_SESSION_SECRET`

## Cloudflare Setup

D1 was created in Cloudflare region EEUR and migrations were applied successfully.

Re-apply migrations if new migration files are added:

```bash
npx wrangler d1 migrations apply barber-brothers-db --remote
```
