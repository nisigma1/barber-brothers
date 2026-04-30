# Project Todo

## Status

- Project: Barber Brothers MVP
- Date: 2026-04-26
- Current phase: Specification review

## Checklist

- [x] Create project documentation structure
- [x] Capture discussion history from the initial interview
- [x] Narrow scope to lean MVP requirements
- [x] Gather booking system rules and business constraints
- [x] Draft MVP specification for review
- [x] Revise the spec with safety, timezone, validation, and edge-case rules
- [x] Review the draft spec with the user
- [x] Adjust the spec based on feedback
- [x] Initialize the Next.js project after spec approval
- [x] Implement public pages after approval
- [x] Implement booking flow after approval
- [x] Implement protected staff login and bookings list after approval
- [x] Test mobile responsiveness after implementation
- [x] Run production build after implementation
- [x] Create a new Firebase project for this app
- [x] Prepare Firebase Hosting and Firestore config files
- [ ] Configure Firebase services and deploy hosting
- [ ] Initialize git if needed and push to a private repository
- [x] Refresh the UI with real Barber Brothers brand assets and premium booking UX
- [x] Simplify the booking UX into barber, date, time, details, confirmation

## Review Notes

- The spec was approved before implementation began.
- The Next.js, TypeScript, and Tailwind scaffold is now in place at the project root.
- Local implementation for the MVP is in place: home page, booking page, booking APIs, Firebase wiring, language switcher, and protected staff area.
- Timezone handling was updated so runtime date utilities use `Europe/Tirane`, while product-facing language and stored timezone labels remain `Europe/Pristina` / Kosovo time.
- `npm run lint`, `npm run typecheck`, and `npm run build` are passing after the timezone alias update.
- Responsive QA passed on mobile, tablet, and desktop production views with no horizontal overflow.
- Local production smoke test passed for `/`, `/booking`, `/staff/login`, `/staff/bookings`, `GET /api/staff/bookings` unauthenticated `401`, and empty `POST /api/bookings` validation `400`.
- Full persisted booking, staff list data, and double-booking race-condition runtime checks remain Firebase-dependent and should be tested after Firebase setup.
- Firebase project `barber-brothers-3786c` is now connected to the local workspace.
- Firebase Web App `Barber Brothers Web` was created and SDK config was added to local/prod env files.
- Firestore API was enabled, the default Firestore database was created, and Firestore rules were deployed.
- Important note: Firebase CLI created the default Firestore database in `nam5` while deploying rules. This does not block the MVP, but it is a region/location limitation to keep in mind.
- Firebase Auth is not initialized yet: CLI returned `CONFIGURATION_NOT_FOUND`.
- Firebase Auth Email/Password and the shared staff account must be enabled/created in Firebase Console before staff-login runtime verification and deployment can continue.
- Post-Firebase-config checks passed: `npm run lint`, `npm run typecheck`, and `npm run build`.
- Firebase Auth is now initialized after Console setup; `auth:export` succeeds.
- Local runtime test reached the real app, but booking creation fails locally because Firebase Admin SDK has no local Application Default Credentials/service-account credential.
- Deployment is still paused until we choose a safe local credential strategy or explicitly move runtime verification to Firebase-hosted runtime.
- User chose hosted-runtime verification and explicitly rejected local service-account key creation/download.
- Build script now uses `next build --webpack` because Turbopack hit a Windows/OneDrive temp-file race while writing `.next/static`.
- Firebase Hosting framework deploy hit Windows symlink permission limits (`EPERM`).
- Added a local deploy shim that makes Firebase CLI copy dependencies instead of creating symlinks during deploy on this Windows machine.
- Firebase Hosting deploy is blocked by project billing: enabling Cloud Build/Artifact Registry for the required SSR/API Cloud Function failed because no billing account is attached to the Firebase project.
- Live runtime verification is blocked until billing is enabled or the app architecture is changed to avoid server routes.
- Confirmed scope clarification: this is a normal browser-based responsive website only, not Android/iOS and not PWA.
- Retried deployment from a clean temp folder outside OneDrive. Build/file-lock issues were resolved, but Firebase still blocked deploy because project `barber-brothers-3786c` must be on Blaze to enable `cloudbuild.googleapis.com`.
- User asked to avoid Blaze for now and test Spark/static feasibility.
- Static export proof failed for the current implementation because Next.js API routes and the dynamic confirmation route require a server runtime.
- Spark-compatible path requires converting booking/staff operations from Next API routes + Admin SDK to Firebase Web SDK + Firestore security rules/client transactions.
- Deployment remains intentionally blocked until local verification is complete.
- Added real Barber Brothers assets from Instagram plus user-shared haircut photos into `public/brand`.
- Home page was redesigned around a real-image hero, premium CTA treatment, gallery grid, barber cards, and stronger contact blocks.
- Booking page and booking form were refreshed to feel closer to modern appointment products, with clearer selection states and larger touch targets.
- Staff login and bookings screens were aligned visually with the public site so the private area no longer feels disconnected.
- Removed the weak fourth gallery image from the active UI and confirmed no `gallery-4`, `hero-real`, `localtunnel`, or `loca.lt` references remain in source/output.
- Rebuilt the booking form around the required flow: select barber, select date, view visible time-slot grid, enter details, confirm.
- Time slots now render as a visible 09:00-21:00 grid with unavailable slots disabled and selected slots highlighted in gold.
- Confirmation summary no longer falls back to dash placeholders; it only shows real selected booking data.
- QA after the booking simplification: `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- Production recovery pass: homepage was simplified to hero, service, barber choice, small 3-image gallery, hours, and contact.
- Booking page now starts directly with the barber/date/time flow instead of a large decorative image panel.
- Language initialization was stabilized to prevent server/client hydration mismatch.
- Slot grid now appears immediately after barber selection using deterministic local slots, then Firestore availability can refine booked/locked states.
- Fixed the default booking date so it skips same-day dates with no valid 1-hour-ahead slots and opens on the first actually bookable day.
- Local static preview is running on port `3020`; verified `/`, `/booking`, `/staff/login`, and LAN access at `http://192.168.0.109:3020/booking` all return `200`.
- Production bug fix: captured the real save failure as Firestore `permission-denied`, deployed corrected Firestore rules only, verified a real Firebase booking write succeeds, then deleted the temporary test booking and slot lock.
- Header cleanup: removed the duplicate desktop `Rezervo` CTA so the top navigation shows the booking action only once.
