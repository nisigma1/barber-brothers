# Barber Brothers

Responsive booking website for Barber Brothers in Fushe Kosove.

## Tech

- Next.js static export
- TypeScript
- Tailwind CSS
- Firebase Auth + Firestore
- Cloudflare Pages

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
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

The Cloudflare Pages config is in:

```text
wrangler.toml
```

Deploy manually with Wrangler after Cloudflare login:

```bash
npm run pages:deploy
```

Preview locally with Cloudflare Pages runtime:

```bash
npm run pages:preview
```

## Custom Domain

After the first Cloudflare Pages deploy:

1. Open Cloudflare Dashboard.
2. Go to `Workers & Pages`.
3. Open the `barber-brothers` Pages project.
4. Go to `Custom domains`.
5. Add `barberbrothers.style`.
6. Follow Cloudflare DNS instructions until the domain is active.
