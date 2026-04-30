# Barber Brothers MVP Spec

> Update 2026-04-30: active deployment/backend target changed from Firebase to Cloudflare Pages + Cloudflare Pages Functions + Cloudflare D1. See `docs/cloudflare-migration.md` for the current runtime and database decisions. Earlier Firebase references below are retained as historical spec context.

## Status

- Draft date: 2026-04-26
- Status: Awaiting user review
- Implementation: Not started

## Product Summary

Barber Brothers is a small bilingual barbershop website for a single location in Fushe Kosove, Kosovo. The MVP should help visitors quickly understand the shop, see basic information, and complete an instant online booking for a haircut with one of two barbers.

## Goals

- Provide a clean public website that feels modern, minimal, and dark masculine.
- Make online booking the primary action and easiest path for the user.
- Allow customers to book directly on the site without third-party booking software.
- Save bookings to Firebase and prevent double-booking for the selected barber.
- Give staff a simple protected area to view and delete bookings.

## Non-Goals

- No blog
- No newsletter
- No advanced SEO program
- No CMS
- No multi-location support
- No complex integrations
- No cancel or reschedule flow in v1
- No multi-service selection in v1
- No public bookings list

## Target Users

- Primary users are local customers in Kosovo looking to book a haircut.
- Traffic is expected to be mobile-first.
- The website should support Albanian-first content with English as a secondary language.

## Brand and Location

- Public brand name: Barber Brothers
- City: Fushe Kosove
- Country: Kosovo
- Product-facing timezone label: Europe/Pristina / Kosovo time
- Runtime timezone alias: Europe/Tirane

## Pages and Routes

### Public

- `/` Home page
- `/booking` Booking page

### Protected Staff Area

- `/staff/login` Staff login page
- `/staff/bookings` Protected bookings list

## Home Page Scope

The home page should include only these essential sections:

- Hero
- Short about section
- Barbers section for 2 barbers
- Working hours section
- Booking call-to-action section
- Contact section

The booking section on the home page should act as a strong CTA and link users into the booking flow. The dedicated booking page should be the main place where the form and date/time selection live.

## Booking Scope

### Service Model

- Single fixed service in v1
- Service name: Haircut
- Duration: 40 minutes
- Price: 5 EUR
- Service is shown as fixed text, not a selectable dropdown

### Barbers

- Two barbers only in v1
- Temporary public names: `Barber 1` and `Barber 2`
- User must choose one barber
- No `Any available` option

### Working Schedule

- Open Monday to Saturday
- Operating hours: 09:00-21:00
- Sunday closed
- Both barbers share the same schedule in v1

### Slot Rules

- Slot interval is 40 minutes
- One booking blocks one 40-minute slot for the selected barber only
- Each barber has independent availability
- Same-day booking is allowed
- Booking can be made up to 7 days ahead
- User must book at least 1 hour before the selected slot
- No blocked times, breaks, or custom closed dates in v1

### Derived Slot Behavior

Based on 09:00-21:00 operating hours and 40-minute duration, the last valid slot start time should be 20:20 so the appointment ends at 21:00.

### Slot Generation Strategy

- Slots are not pre-generated or stored ahead of time
- Slots are calculated dynamically and deterministically from:
  - shop timezone
  - weekly working hours
  - service duration
  - selected barber
  - selected date within the 7-day booking window
- For each eligible day, the system should generate this predictable sequence:
  - 09:00, 09:40, 10:20, 11:00, 11:40, 12:20, 13:00, 13:40, 14:20, 15:00, 15:40, 16:20, 17:00, 17:40, 18:20, 19:00, 19:40, 20:20
- Availability is determined by comparing generated slots against active slot locks for the selected barber
- This keeps slot generation deterministic and avoids inconsistencies caused by pre-created slot records

## Public Booking Flow

### User Journey

1. User enters the booking page.
2. User sees the fixed service details.
3. User chooses one barber.
4. User chooses a valid date within the next 7 days.
5. User sees only available 40-minute slots for that barber and date.
6. User enters first name, last name, and phone number.
7. User submits the booking.
8. The system validates the rules and prevents double-booking.
9. The booking is saved to Firebase.
10. The user sees a confirmation screen with the full booking summary.

### Submission Behavior

- Booking submission should go through a server-side endpoint, not direct public client writes to Firestore
- The submit button should be disabled while a request is in flight
- Each booking attempt should carry a client-generated `submissionId` for idempotent retry handling
- A successful booking should redirect or transition to a confirmation state that can be safely refreshed without creating another booking

### Confirmation Content

The success state should show:

- Selected barber
- Selected date
- Selected time
- Customer phone number

## Staff Area Scope

### Access

- Staff area must be protected behind login
- V1 uses one shared staff account
- Proposed implementation for review: Firebase Authentication email/password
- Unauthenticated users must not be able to access the staff bookings route
- Protected booking data should only be returned after successful authentication and authorization checks

### Bookings List

The protected staff area should provide a minimal internal bookings list with:

- View upcoming bookings
- Delete bookings

The staff area does not need:

- Separate roles
- Multiple staff accounts
- Booking edit flow
- Cancel or reschedule flow
- Analytics dashboard

## Data Model

### Booking Record

Each booking should store at minimum:

- Booking ID
- Submission ID
- Slot key
- Barber ID
- Barber display name snapshot
- Service name snapshot
- Service duration snapshot
- Service price snapshot
- Booking date
- Booking start time
- Booking end time
- Booking start timestamp in UTC
- Booking end timestamp in UTC
- Customer first name
- Customer last name
- Customer phone number
- Timezone
- Status
- Created timestamp
- Deleted timestamp when applicable

### Slot Lock Record

To guarantee safe slot reservation, the system should also maintain a deterministic slot lock record containing at minimum:

- Slot key
- Barber ID
- Local booking date
- Local booking start time
- Booking ID currently holding the slot
- Status: `active` or `released`
- Start timestamp in UTC
- End timestamp in UTC
- Created timestamp
- Released timestamp when applicable

### Submission Record

To support safe retry behavior, the system should maintain a lightweight submission record containing at minimum:

- Submission ID
- Booking ID
- Slot key
- Created timestamp

### Proposed Storage

- Firebase Firestore for bookings
- Firebase Authentication for the shared staff login

### Timezone Storage Policy

- UTC is the canonical storage format for booking timestamps in the database
- Europe/Pristina is the canonical display and scheduling timezone in the UI
- Europe/Pristina is not a valid IANA runtime timezone, so date utilities must use the runtime alias `Europe/Tirane`
- Kosovo follows the same timezone behavior as `Europe/Tirane`, so this keeps calculations stable while preserving Kosovo-facing language
- The booking record should store:
  - UTC timestamps for exact persistence and comparisons
  - local date and local time snapshots for deterministic slot generation and easier staff display
- All booking window, same-day cutoff, and business-hour validation must be evaluated with the `Europe/Tirane` runtime alias for Kosovo time, then persisted in UTC

### Delete Behavior

- Staff deletion should be implemented as soft delete, not hard delete
- Deleting a booking should update the booking `status` to `deleted`
- Soft delete should also set `deletedAt`
- The related slot lock should be released so that the time slot becomes bookable again
- Soft-deleted bookings must remain hidden from the normal active staff list by default

### Double-Booking Protection Strategy

Double-booking prevention must be enforced at the database write layer with Firestore transactions, not only in the UI.

Proposed strategy:

1. Generate a deterministic slot key in local shop time:
   - format example: `barber-1__2026-04-30__09-40`
2. When the user submits, call a server-side booking endpoint.
3. In a single Firestore transaction:
   - read `bookingSubmissions/{submissionId}`
   - read `slotLocks/{slotKey}`
   - if `bookingSubmissions/{submissionId}` already exists, return the existing booking result for idempotent retry safety
   - if `slotLocks/{slotKey}` exists with status `active`, reject the booking as unavailable
   - otherwise create:
     - a new booking record with status `confirmed`
     - an `active` slot lock for the slot key
     - a submission record keyed by `submissionId`
4. Commit all three writes atomically.

This strategy ensures:

- only one confirmed booking can own one barber slot at a time
- repeated client retries do not create duplicate bookings
- database-level protection still works even if two users submit at nearly the same moment

## Validation Rules

The system should reject booking attempts when:

- Required fields are missing
- First name or last name is empty after trimming
- Phone number is empty or invalid after normalization
- No barber is selected
- The chosen date is outside the next 7 days
- The chosen day is Sunday
- The chosen slot starts less than 1 hour from the current time
- The chosen slot falls outside working hours
- The slot is already booked for the selected barber

### Phone Number Validation

V1 should use a simple Kosovo-focused validation rule:

- accept a normalized international format matching `+383` followed by 8 digits
- optionally accept local input beginning with `0` followed by 8 digits, then normalize it to `+383`
- reject any value that does not normalize into one of those valid Kosovo formats

Examples that should be accepted after normalization:

- `+38345990079`
- `045990079`

### Basic Duplicate and Spam Protection

V1 should include lightweight abuse protection without adding complex anti-bot infrastructure:

- trim and validate all input server-side
- disable repeated submit attempts while the first request is still in progress
- use `submissionId` for idempotent retries
- reject exact duplicate active bookings for the same slot
- use a hidden honeypot field and reject requests that fill it

Advanced rate limiting and CAPTCHA are out of scope for v1 unless added later.

## Concurrency and Safety

- Double-booking prevention must happen at write time, not only in the UI
- The save operation should verify the slot again before creating the booking
- Two users can book the same time only if they select different barbers
- Public booking creation should go through server-side logic using trusted credentials, not unrestricted public client writes
- Active bookings list queries should exclude soft-deleted records by default

## Localization

- Default language: Albanian
- Secondary language: English
- Manual visible language switcher is required

### Translation Scope

Translate all user-facing content for:

- Navigation
- Hero text
- Booking labels and buttons
- Working hours
- Contact section
- Staff login labels
- Booking confirmation content
- Validation and error messages

## UI Direction

- Style: modern, minimal, dark masculine
- Layout approach: mobile-first and responsive
- Booking should be visually prominent and easy to use on mobile
- The design should feel clean and premium without adding unnecessary visual complexity

## Contact Content

- Primary phone: +38345990079
- Secondary phone: +38345990003
- Instagram handle: brotherscutss
- Address: Rruga Xhemail Mustafa, Fushe Kosove
- Google Maps link: placeholder for now
- Contact area should use a maps link/button only, not an embedded map

## Placeholder Content Approved For V1

- `Barber 1`
- `Barber 2`
- Google Maps link placeholder

## Technical Stack For Implementation

These are the implementation defaults already agreed for project execution:

- Next.js
- TypeScript
- Tailwind CSS
- Firebase Hosting for final deployment
- Firebase project created specifically for this app

## Acceptance Criteria

The MVP will be considered ready for implementation review when the final build can satisfy all of the following:

- The site has a public home page and dedicated booking page
- The UI is responsive and usable on mobile and desktop
- Albanian loads by default
- Users can manually switch between Albanian and English
- The haircut service is visible as fixed service info
- Users must choose one of the two barbers before booking
- Users can book available slots only from Monday to Saturday between 09:00 and 21:00
- Slots are generated in 40-minute intervals
- Slots are generated dynamically from business rules rather than pre-created in the database
- Same-day booking works if the slot is at least 1 hour ahead
- Users cannot book more than 7 days into the future
- One barber's booking does not block the other barber's same-time slot
- Booking timestamps are stored in UTC and displayed in Europe/Pristina time
- Runtime date calculations use `Europe/Tirane` as the IANA-compatible alias for Kosovo time
- Double-booking is prevented with a Firestore transaction-based locking strategy
- Booking data is saved in Firebase
- Users see a success confirmation with barber, date, time, and phone
- Invalid and empty phone/name input is rejected
- Kosovo phone numbers are normalized and validated
- Duplicate submit and basic retry behavior do not create duplicate bookings
- Staff can log in through a protected route
- Staff can view bookings in a private internal list
- Staff can soft-delete bookings
- Public users cannot access booking data
- Unauthenticated users cannot access the internal bookings list

## Edge Case Behavior

### Refresh After Booking

- After successful booking, the user should land on a confirmation state tied to the saved booking result
- Refreshing the confirmation page must not create a second booking
- The booking form should not auto-resubmit on refresh or back/forward navigation

### Double Click Submit

- The submit button should lock immediately after the first click
- If a second request still reaches the server, the same `submissionId` should cause the server to return the original booking result instead of creating a duplicate

### Slow Network or Retry

- The UI should show a visible pending state while the request is processing
- If the client retries the same request, idempotency should return the same success result when applicable
- If the slot was truly taken by a different successful request, the user should receive a clear unavailable-slot message and be prompted to pick another slot

### Last Available Slot

- `20:20` is a valid slot because it ends at `21:00`
- `21:00` is not a valid slot start
- Same-day booking for the `20:20` slot is allowed only if the user books it at least 1 hour earlier in Kosovo time, calculated with the `Europe/Tirane` runtime alias

### Staff Deletion

- When staff soft-delete a booking, that booking should disappear from the active list
- The released slot should become available for future booking again
- The deleted record should remain in the database for audit and recovery purposes

## Open Technical Decisions For Review

These are proposed implementation details, not unresolved product requirements:

- Use Firebase Authentication email/password for the single shared staff account
- Use Firestore as the booking database
- Keep the protected bookings list minimal and focused on upcoming bookings only
- Use server-side booking writes with transaction-based slot locking and idempotent submission handling

## Out of Scope For V1

- Additional services
- Deposits
- Barber-specific custom schedules
- Breaks or blocked dates editor
- SMS or email notifications
- Customer accounts
- Staff role management
- Booking edit flow
- Cancelation or rescheduling
- Embedded maps
- Analytics dashboards
- Advanced SEO pages

## Next Step After Review

If this spec is approved, the next phase should be:

1. Create `tasks/todo.md` implementation checklist updates if needed
2. Scaffold the Next.js app
3. Build the public pages
4. Build the booking flow and validation
5. Build the protected staff area
6. Test mobile responsiveness and booking behavior
7. Run production build
8. Create a new Firebase project and deploy
9. Push the code to a private Git repository
