# Discussion History

## Project

- Name: Barber Brothers MVP
- Date started: 2026-04-26
- Participants: User, Codex
- Status: Discovery and specification only

## Session 1 Summary

This session established the working process and captured the full MVP requirements before any implementation. The user explicitly requested a strict sequence: deep interview first, then a full written spec, then review, and only after approval should implementation begin.

## Process Decisions

| Topic | Decision | Rationale |
| --- | --- | --- |
| Implementation timing | No coding before spec review and approval | Prevent incorrect assumptions and rework |
| Project scope | Small MVP only | Keep v1 lean and practical |
| Interview style | Focus only on critical booking and MVP questions | Avoid enterprise-level over-scoping |
| Documentation | Maintain discussion history and task tracking from project start | Preserve context and decision rationale |

## Requirement Narrowing

The user asked to ignore the following for now:

- Blog
- Newsletter
- Advanced SEO
- CMS
- Multi-location support
- Complex integrations

The user asked to refocus only on:

- Booking system as the core feature
- Working hours
- Time slots
- Barber selection for 2 barbers only
- UI style
- Language
- Basic pages: home and booking

## Interview Record

| # | Question | Answer |
| --- | --- | --- |
| 1 | Booking type for v1 | Instant online booking |
| 2 | Booking implementation | Custom booking flow built directly inside the website |
| 3 | Barber setup | 2 barbers, temporary names `Barber 1` and `Barber 2` |
| 4 | Barber choice behavior | User must choose one barber, no `Any available` option |
| 5 | Services | Single service: `Haircut`, 40 minutes, 5 EUR |
| 6 | Working schedule | Monday to Saturday, 09:00-21:00; Sunday closed |
| 7 | Barber availability | Both barbers share the same hours |
| 8 | Slot interval | 40 minutes |
| 9 | Blocked times | None in v1 |
| 10 | Customer data collected | First name, last name, phone number |
| 11 | Booking completion behavior | Show confirmation message and save booking to Firebase |
| 12 | Site language | Albanian and English |
| 13 | Default language and switcher | Albanian default with manual language switch |
| 14 | Public pages/sections | Home with hero, short about, barbers, working hours, booking focus, contact |
| 15 | Contact details | Phone, Instagram, address, Google Maps link |
| 16 | Public brand name | Barber Brothers |
| 17 | Business location | Fushe Kosove, Kosovo |
| 18 | Timezone | Europe/Pristina |
| 19 | Booking window | Same-day allowed; up to 7 days ahead |
| 20 | Booking cutoff | Minimum 1 hour before slot start |
| 21 | Slot independence | Each barber has independent slots |
| 22 | Slot blocking rule | One booking blocks one 40-minute slot for the selected barber only |
| 23 | Booking management | Minimal internal bookings list inside the site |
| 24 | Cancel/reschedule | Not included in v1 |
| 25 | Contact numbers | Primary: +38345990079; Secondary: +38345990003 |
| 26 | Instagram handle | brotherscutss |
| 27 | Address | Rruga Xhemail Mustafa, Fushe Kosove |
| 28 | Maps | Link only, no embedded map; placeholder link for v1 |
| 29 | Service selection UI | Single fixed service shown as text, not selectable |
| 30 | Confirmation UI | Show full summary: barber, date, time, phone |
| 31 | Bookings list access | Protected staff login |
| 32 | Staff account model | One shared staff account for v1 |
| 33 | Bookings list actions | View and delete |
| 34 | Placeholder approval | Keep temporary barber names and maps link for launch v1 |

## Key Product Decisions

| Area | Decision | Why it matters |
| --- | --- | --- |
| Core journey | Visitor lands on site, reviews brand details, books a slot instantly | Booking is the main conversion goal |
| Pages | `Home` plus dedicated `Booking` page/flow | Keeps navigation simple while preserving a focused booking experience |
| Privacy | Booking list is protected behind staff login | Customer data should not be public |
| Admin scope | One shared staff account and minimal actions | Safer than public access without adding full role management |
| Data storage | Firebase-backed booking persistence | Matches deployment stack and future extensibility |
| Localization | Albanian first, English available manually | Serves the primary audience while remaining accessible to English speakers |
| Design direction | Modern, minimal, dark masculine | Establishes the visual baseline for v1 |

## Constraints and Placeholders

- Barber names remain placeholders until final names are provided.
- Google Maps link remains a placeholder until the final destination URL is available.
- No complex staff admin, reports, notifications, cancelation flow, or multi-service logic in v1.
- No blog, newsletter, CMS, or advanced SEO work in v1.

## Next Step

Write the draft MVP specification and review it with the user before any application code is created.

## Session 2 Review Feedback

Before approving the first draft spec, the user requested deeper clarity and stricter handling in several technical areas.

### Requested Adjustments

| Topic | User request | Outcome for next spec revision |
| --- | --- | --- |
| Double booking protection | Must be safe at database level, not just UI level | Add explicit Firestore transaction-based locking strategy |
| Slot generation | Prefer deterministic generation from working hours | Define dynamic slot calculation instead of pre-generated slots |
| Timezone | Store in UTC, display in Europe/Pristina | Make UTC canonical for storage and Europe/Pristina canonical for scheduling/display |
| Validation | Add phone format validation, empty input protection, and duplicate spam safeguards | Expand validation and lightweight anti-duplicate rules |
| Booking list security | Confirm it is protected with Firebase Auth | Require authenticated staff access only |
| Delete behavior | Prefer soft delete instead of hard delete | Update spec to use `status = deleted` style behavior |
| Edge cases | Define refresh, double submit, slow network, retry, and last-slot behavior | Add explicit edge-case behavior rules to spec |

### Review Notes

- The user wants this clarified in the specification before approval, not deferred to implementation.
- The user prefers deterministic and safety-first booking behavior even in a lean MVP.
- The user explicitly wants soft delete to avoid accidental data loss.

## Session 3 Timezone Alias Decision

During local build verification, `Europe/Pristina` was found to be rejected by the runtime date tooling because it is not a valid IANA timezone identifier. The user approved aliasing runtime calculations to `Europe/Tirane` while keeping the product-facing label as `Europe/Pristina` / Kosovo time.

| Topic | Decision | Rationale |
| --- | --- | --- |
| Runtime timezone | Use `Europe/Tirane` for date utilities | Valid IANA timezone with the same behavior needed for Kosovo time |
| Product-facing timezone | Keep `Europe/Pristina` / Kosovo time in UI/spec language | This matches the business location and user expectation |
| Storage | Continue storing canonical timestamps in UTC | Keeps persistence stable and timezone-independent |

## Session 4 Responsive QA And Local Smoke Test

The user approved deleting the generated `.next` folder after a stale Windows/OneDrive build artifact blocked a follow-up build. The `.next` directory was deleted as generated output only, then the app was rebuilt from source.

| Check | Result | Notes |
| --- | --- | --- |
| Fresh production build | Passed | `.next` was regenerated cleanly |
| Mobile viewport | Passed | No horizontal overflow on 390px viewport |
| Tablet viewport | Passed | No horizontal overflow on 768px viewport |
| Desktop viewport | Passed | No horizontal overflow on 1440px viewport |
| Language switcher | Passed | Albanian default and English switch verified |
| Staff pages | Passed locally | Show safe configuration/protected-state messaging before Firebase setup |
| Staff API without auth | Passed | Returned expected `401` |
| Empty booking request | Passed | Returned expected validation `400` |
| Persisted booking flow | Pending Firebase setup | Requires Firebase Admin/client credentials |
| Double-booking runtime test | Pending Firebase setup | Requires Firestore transaction execution |

### QA Fixes Made

- Albanian date labels were changed from browser-locale fallback text to deterministic Albanian labels.
- Booking page now shows a clear `choose a barber first` state before slot availability loads.
- Customer-facing copy no longer exposes Firebase implementation details.
- Staff UI copy was cleaned up to refer to staff access rather than Firebase Auth.
- Staff bookings page no longer shows an empty active-bookings state when the booking backend is not configured.

## Session 5 Firebase Deployment Preparation

The user approved installing and running Firebase CLI tooling via `npx` or `npm`. Firebase CLI 15.15.0 was available through `npx firebase-tools`, but the local machine had no authorized Firebase account.

| Topic | Decision | Rationale |
| --- | --- | --- |
| Staff email | `staff@barberbrothers.com` | Shared v1 staff account |
| Staff password | Set securely in Firebase Console | Avoid storing or transmitting the password through the local project |
| Public Firestore access | Denied for direct client reads/writes | Booking creation must go through server-side transaction logic to preserve `slotLocks` safety |
| Staff Firestore access | Authenticated staff email can read booking data | Keeps private booking data out of public access |
| Deployment config | Firebase Hosting framework-aware config prepared | Required because the app uses Next.js server routes |

### Firebase Project Creation Blocker

The CLI was authenticated as `enis.qetaj@student.uni-pr.edu`, but `firebase projects:create barber-brothers-fushe-kosove --display-name "Barber Brothers Fushe Kosove"` failed before project creation completed.

| CLI result | Meaning | Required next action |
| --- | --- | --- |
| `Callers must accept Terms of Service` | Google Cloud terms have not been accepted for the signed-in account | User must accept Google Cloud/Firebase terms in the browser/console, then rerun the Firebase setup phase |

## Session 6 Firebase Project Connection

After the user created the Firebase project manually, the local workspace was connected to project `barber-brothers-3786c`.

| Item | Result | Notes |
| --- | --- | --- |
| Firebase project | `barber-brothers-3786c` | Display name: `barber-brothers` |
| Web app | Created | App name: `Barber Brothers Web` |
| SDK config | Added to local/prod env files | Public Firebase web config only; no staff password stored |
| Firestore API | Enabled | Enabled through Firebase CLI during rules deploy |
| Firestore database | Created | Default database was created by Firebase CLI in `nam5` |
| Firestore rules | Deployed | Direct public reads/writes are denied; booking writes must go through server transaction logic |
| Firebase Auth | Blocked | CLI returned `CONFIGURATION_NOT_FOUND`; Email/Password and staff user need Console setup |

### Firestore Location Note

Firebase CLI created the default database in `nam5` when deploying Firestore rules. This is functional for the MVP and keeps the deployment moving, but it is not the ideal Europe-first location preference. Because the default Firestore database location is a long-term infrastructure decision, this is recorded as a risk/limitation for future review.

### Auth Setup Blocker

Firebase Auth is not initialized for this project yet. The CLI check returned `CONFIGURATION_NOT_FOUND`, so staff login cannot be verified until Email/Password sign-in is enabled and the shared staff account is created in Firebase Console. The staff password remains intentionally absent from local files and documentation.

## Session 7 Firebase Hosting Deployment Attempt

The user chose hosted-runtime verification and explicitly rejected creating/downloading a local service-account key. Local verification therefore stayed limited to public validation/protection checks, and the app was prepared for Firebase-hosted runtime verification where Admin SDK credentials are provided by Google infrastructure.

| Step | Result | Notes |
| --- | --- | --- |
| Final lint | Passed | `npm run lint` |
| Final typecheck | Passed | `npm run typecheck` |
| Final build | Passed after adjustment | Build script uses `next build --webpack` to avoid a Windows/OneDrive Turbopack temp-file race |
| Firebase Hosting deploy | Blocked | Next.js server routes require a Cloud Function |
| Windows symlink issue | Worked around | Firebase CLI dependency symlinks were converted to copies during deploy |
| Cloud Functions/API setup | Blocked by billing | Cloud Build/Artifact Registry activation failed because no billing account is attached |

### Billing Blocker

Firebase Hosting with this Next.js app needs server infrastructure because the MVP includes API routes for booking creation, availability, staff reads, and soft delete. Google requires billing to enable the Cloud Build/Artifact Registry services needed to deploy that server runtime. Deployment and live runtime verification are blocked until billing is enabled on project `barber-brothers-3786c`, or the app architecture is changed to a static/client-only Firebase implementation.

### Website Scope Clarification

The user clarified that `website` means a normal responsive browser website for desktop and mobile. The project is not an Android app, not an iOS app, and not a PWA unless explicitly approved. Deployment remains Firebase Hosting for the browser-based booking website.

### Deployment Retry From Clean Folder

To avoid Windows/OneDrive file locking, deployment was retried from a clean copy under the local temp directory. This resolved the local build/file-lock issue and reached Firebase service checks. Firebase then returned a hard platform requirement: project `barber-brothers-3786c` must be upgraded to Blaze/pay-as-you-go before `cloudbuild.googleapis.com` can be enabled, which is required by the Next.js server runtime.

## Session 8 Spark Static Hosting Review

The user requested holding off on Blaze and checking whether the project can be deployed as a static Firebase Hosting site on Spark/free plan.

| Check | Result | Notes |
| --- | --- | --- |
| Current app static export | Failed | `output: "export"` cannot export the current API route handlers and dynamic confirmation route |
| Feature forcing server runtime | Next.js API routes | `/api/availability`, `/api/bookings`, `/api/staff/bookings`, `/api/staff/bookings/[bookingId]` |
| Feature forcing dynamic route handling | Booking confirmation by `bookingId` | `/booking/confirmation/[bookingId]` currently reads booking data server-side |
| Firebase feature forcing Blaze | Cloud Function generated by Firebase Hosting framework support | Required to run the Next.js server/API routes |

### Spark-Compatible Alternative

To keep Spark/free plan, the app needs to become fully static:

- Remove Next.js API routes and `firebase-admin` runtime usage.
- Use Firebase Web SDK directly from browser code.
- Use Firestore client transactions or atomic batch writes with deterministic `slotLocks/{slotKey}` documents.
- Use Firestore Security Rules to validate public booking writes, deny public booking reads, allow only staff-authenticated reads/updates, and require lock/booking consistency.
- Allow public reads only for non-PII slot lock availability data if the UI should show unavailable slots.
- Keep staff login with Firebase Auth in the browser.
- Implement staff soft delete as an authenticated client transaction that marks the booking deleted and releases the slot lock.

This preserves a normal responsive browser website and avoids Android/iOS/PWA work, but it requires a targeted architecture change before static Firebase Hosting deployment.

## Session 8 Cloudflare Migration

The user moved hosting direction to Cloudflare Pages with production domain `barberbrothers.style` and requested removing Firebase from the active app. The migration target is Cloudflare Pages, Pages Functions, and D1.

| Topic | Decision | Rationale |
| --- | --- | --- |
| Hosting | Cloudflare Pages | User connected the project to GitHub and chose Cloudflare as the live platform |
| Database | Cloudflare D1 | Keeps booking data on Cloudflare instead of Firebase |
| Booking API | Cloudflare Pages Functions | Preserves server-side booking logic while keeping the frontend as a static export |
| Double booking protection | D1 `slot_locks.slot_key` unique key | Enforces slot conflicts at the database layer |
| Staff auth | HttpOnly signed Cloudflare session cookie | Avoids Firebase Auth and keeps staff pages protected |

### Result

Wrangler login completed for `enis.qetaj@student.uni-pr.edu`. Cloudflare D1 database `barber-brothers-db` was created in EEUR with ID `1fd74c5a-6bf8-4356-aadb-422c716a4186`, migration `0001_initial.sql` was applied, and remote tables `bookings` and `slot_locks` were verified. Cloudflare Pages production secrets were set for staff email, session secret, and staff password. The temporary generated staff password is stored only in the local ignored file `.staff-login-secret.txt`.

### Staff Account Update

The user requested staff access through personal emails instead of a shared account because more barbers may be added later. Staff authentication was moved to D1-backed accounts in `staff_users`. Signup is available at `/staff/signup` and requires the private `STAFF_SIGNUP_CODE`; login is available at `/staff/login`. Current barber labels were changed to `Uraniku` and `Hysi`.

## Session 9 Homepage Copy, Timing Rules, And Project Cleanup

The user requested a stricter production cleanup before considering the website finished.

| Topic | Decision | Rationale |
| --- | --- | --- |
| Homepage copy | Reduce repeated slogans, price, and duration mentions | Keeps the site sharper and less demo-like |
| Premium callout | Use uppercase callout copy without extra punctuation | Matches the requested premium format |
| Appointment duration | 30 minutes | Aligns the booking product with the latest user rule |
| Slot interval | 30-minute slots only | Keeps availability predictable and easy to scan |
| Lunch break | Block `12:30-13:00` | No public booking can be shown or saved during lunch break |
| Time formatting | Use 24-hour labels such as `09:00` | Avoids mixed AM/PM formatting |
| Currency copy | Use `5 euro` | Matches the requested local wording |
| Favicon | Use the Barber Brothers logo | Removes the default favicon and makes the browser tab branded |
| Project folder | Move the repo out of `Playground` after verification | Keeps the local codebase easier to find and review |

## Session 10 Homepage Cleanup And Lunch Break Recheck

The user requested final production cleanup for the homepage and strict verification of lunch-break behavior.

| Topic | Decision | Rationale |
| --- | --- | --- |
| Albanian hero headline | `PRERJE PREMIUM PA PRITJE` | Removes the extra word while preserving the premium uppercase style |
| Hero background | Use a clean dark gradient instead of a photo | Removes visible background lettering/watermark noise and improves perceived speed |
| Heavy assets | Remove the unused hero background image | Keeps Cloudflare output lighter |
| Time labels | Use simple 24-hour slot starts in the booking grid | Makes available appointment times faster to scan |
| Lunch break | Keep rejecting `12:30` and `12:45` in the booking API | Prevents manual/API bypass, not just UI hiding |

## Session 11 Working Hours, Hidden Staff Entry, And Speed Pass

The user requested a focused production update without adding new features.

| Topic | Decision | Rationale |
| --- | --- | --- |
| Working hours | Use `09:30-20:30` | Matches the real shop schedule |
| First slot | `09:30` | `09:00` is no longer valid or visible |
| Last slot | `20:00` | A 30-minute service ending at `20:30` stays inside working hours |
| Lunch break | Keep `12:30-13:00` blocked | `12:30` is invalid, while `13:00` remains valid |
| Public staff link | Remove staff from desktop and mobile navigation | Customers should not see staff access |
| Direct staff entry | Add `/staff` route | Staff can still use a direct private link and be routed based on auth state |
| Speed | Remove heavy staff-page images and compress gallery images | Keeps the site lighter without changing the booking system |

## Session 12 Staff PIN Access Simplification

The user requested removing account creation/login complexity from the staff access screen.

| Topic | Decision | Rationale |
| --- | --- | --- |
| Staff access UI | Show only barber profile and private PIN | Keeps staff access simple for the two current barbers |
| Uraniku PIN | `1313` | User-provided PIN |
| Hysi PIN | `1212` | User-provided PIN |
| Signup route | Redirect `/staff/signup` to `/staff/login` | Removes account creation from the product flow |
| Staff filtering | Show each barber only their own bookings | Profile-based PIN access should not expose another barber's schedule |
| Session | Keep HttpOnly staff session cookie | Avoids asking for the PIN on every staff action |

## Session 13 Staff Select Contrast And Hours Stat

The user reported that the staff barber dropdown was hard to read because the native menu background appeared light while option labels stayed white. The staff select now forces a dark color scheme and dark option backgrounds. The homepage hero stat was also changed from showing only the opening time to showing the full working schedule `09:30-20:30`.

## Session 14 Production Hardening And Performance Audit

The user requested a production-minded pass focused on headline copy, security, stability under repeated bookings, and speed. The homepage hero headline was changed to `SHERBIM PREMIUM / PA PRITJE` for both languages so the old English headline no longer appears. Staff PINs were moved from source code to Cloudflare Pages secrets. A D1 `request_limits` table was added for booking and staff-login rate limiting, booking names now reject HTML/script-like characters, the client booking form now uses an immediate submit lock against rapid double-clicks, unnecessary Next.js link prefetching was disabled on primary navigation/CTA links, and the transitive `postcss` dependency was overridden to a patched version after `npm audit` reported a moderate advisory.

## Session 15 Language-Specific Hero Headline

The user clarified that the previous all-Albanian headline was a prompt mistake. Albanian mode keeps `SHERBIM PREMIUM / PA PRITJE`; English mode now uses `PREMIUM SERVICE / NO WAITING`.

## Session 16 Booking Form Placeholder And Speed Cleanup

The user reported that example placeholders such as `Arben`, `Krasniqi`, and the full phone number looked like pre-filled customer data. The booking form now uses neutral helper placeholders in Albanian and English instead. Gallery images were resized for a lighter static payload, and unused default public SVG assets were removed.

## Session 17 Booking Resilience Hardening

The user requested continued hardening so the website does not feel dead and remains stable if many clients confirm bookings. Client API calls now time out cleanly instead of leaving the UI waiting forever. Booking submission attempts reuse a stable `submissionId` across retries so a slow network retry remains idempotent. If the backend reports a stale slot (`SLOT_TAKEN`, `INVALID_SLOT`, or `BOOKING_CUTOFF`), the form refreshes availability and clears the selected slot so the customer can immediately choose a valid time.

## Session 18 Albanian Working-Hours Copy

The user noticed the public hours copy said `Hene - Shtune`. The visible Albanian schedule label and body copy now use `E Hene - E Shtune`, and long Albanian weekday names were capitalized consistently.
