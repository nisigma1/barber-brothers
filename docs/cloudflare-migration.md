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
- `staff_users`: stores D1-backed staff accounts for personal email login.

## Staff Access

Staff login is handled by a Cloudflare Pages Function using D1-backed staff users and an HttpOnly signed session cookie.

Required Cloudflare variables/secrets:

- `STAFF_SESSION_SECRET`
- `STAFF_SIGNUP_CODE`

Staff accounts are created through `/staff/signup` using the private signup code, then staff can login with personal emails at `/staff/login`.

## Cloudflare Setup

D1 was created in Cloudflare region EEUR and migrations were applied successfully.

Re-apply migrations if new migration files are added:

```bash
npx wrangler d1 migrations apply barber-brothers-db --remote
```
