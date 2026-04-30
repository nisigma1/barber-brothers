# Barber Brothers

Responsive booking website for Barber Brothers in Fushe Kosove.

## Tech

- Next.js static export
- TypeScript
- Tailwind CSS
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare D1 database

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For the real Cloudflare runtime, including API routes and D1 bindings, use:

```bash
npm run pages:preview
```

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

The production static output is generated into:

```text
out
```

## Cloudflare Pages

Cloudflare project name:

```text
barber-brothers
```

Production domain:

```text
barberbrothers.style
```

Build command:

```bash
npm run build
```

Build output directory:

```text
out
```

## Cloudflare D1

Create the D1 database after `wrangler login`:

```bash
npx wrangler d1 create barber-brothers-db
```

Copy the returned database ID into `wrangler.toml`, then apply migrations:

```bash
npx wrangler d1 migrations apply barber-brothers-db --remote
```

Set these Cloudflare Pages environment variables/secrets:

```text
STAFF_LOGIN_EMAIL=staff@barberbrothers.com
STAFF_LOGIN_PASSWORD=<set securely in Cloudflare>
STAFF_SESSION_SECRET=<long random secret>
```

Deploy manually with Wrangler after Cloudflare login:

```bash
npm run pages:deploy
```
