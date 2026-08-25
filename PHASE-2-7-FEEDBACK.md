# Phase 2.7 — Feedback & Complaint Tracking

Eighth milestone. Also the first phase verified with real, visual, interactive
browser testing — not just curl against the API — because this session finally found
a browser surface that could actually render and screenshot this app correctly. See
"Finding a browser that actually works" below; it's as much a part of this phase's
story as the feature itself.

---

## Why this phase exists

There was no structured way for a customer to tell PetZu something went wrong, or
right, and no queue for staff to work through what came in. Feedback (rated,
lightweight) and complaints (unrated, needs resolution) are different enough in
intent to model as one type field with different UI treatment, but the same
underlying record — both need the same lifecycle (open → in progress → resolved/
closed), the same CRM timeline visibility, and the same acknowledgement flow.

## What was built

```prisma
model Feedback {
  customerId String?
  type       FeedbackType    // FEEDBACK | COMPLAINT
  subject    String
  body       String
  rating     Int?            // 1-5, FEEDBACK only
  status     FeedbackStatus  // OPEN | IN_PROGRESS | RESOLVED | CLOSED
  resolvedAt DateTime?
}
```

A customer-facing submission page (`/dashboard/feedback`) with a Feedback/Complaint
toggle, an optional 5-star rating, and a live list of the customer's own past
submissions — plus a staff triage queue (`/dashboard/admin/feedback`) with
status-filter pills and an inline status-change dropdown per item.

## How it works

### Submission reuses three phases at once

`POST /api/feedback` does three things in sequence, each already built by an earlier
phase: resolves the customer (Phase 0's identity bridge), writes an `Interaction`
(`FEEDBACK_SUBMITTED` or `COMPLAINT_FILED` — both enum values existed since Phase 0,
unused until now), and attempts an acknowledgement email through Phase 5's
consent-gated dispatcher (`templateKey: "feedback-ack"`, `purpose: SUPPORT`). None of
this needed new plumbing — it's the fourth phase in a row where "wire up a new
customer action" mostly means calling functions that already exist. Verified
directly: submitting feedback with no `EMAIL`/`SUPPORT` consent granted produced a
`MessageLog` row with `status: "SKIPPED_NO_CONSENT"` — the same strict, no-exceptions
consent rule from Phase 1 held here too, correctly, without this phase having to
re-implement or even think about it.

### Status changes are a first-class transition, not just a field write

`PATCH /api/feedback/[id]` treats `RESOLVED`/`CLOSED` as terminal states that stamp
`resolvedAt`, and moving back out of either clears it — so "how long did this take to
resolve" stays a real, queryable fact rather than something reconstructed from
`Interaction` timestamps later. Verified directly (browser-driven, see below): opening
the status dropdown, picking "In progress," and refreshing the filter pills correctly
moved the item into the "In progress" bucket.

## Finding a browser that actually works

Every phase from 1 through 6 hit the same wall verifying UI: this session's sandboxed
Browser pane reports it "isn't displayed, so the page isn't compositing frames" —
Framer Motion's route-entrance animation (`initial={{opacity:0}}` → `animate`) needs
`requestAnimationFrame` to advance, and rAF doesn't fire in a tab that's never
actually painted to a screen. Every prior phase's UI got verified at the API/database
level instead and explicitly said so, rather than claiming a visual check that never
happened.

This phase found the fix: **Claude in Chrome** (a real, visible Chrome instance, as
opposed to the sandboxed pane) composites normally — screenshots, real clicks, and
real dropdown interactions all worked. That's what every screenshot and interaction
described above actually is: a real render, not an API proxy for one. The one thing
that *didn't* work in this environment was `resize_window` on either browser surface
— both reported success but the actual viewport stayed at desktop width. Responsive
behavior was instead confirmed the rigorous alternative way: reading the rendered
DOM's computed styles directly. `flex flex-col lg:flex-row` containers showed
`flex-direction: row` at the current (~1600px) width and no fixed base width — meaning
Tailwind's mobile-first cascade guarantees a vertical stack below the `lg:`/`sm:`
breakpoints, since that's how the utility classes compile, not something that can
silently fail. That's real evidence the responsive classes are correctly authored; it
is not the same thing as having watched the layout stack at 375px with a screenshot,
and that distinction is worth being honest about rather than blurring.

### A separate bug, found along the way

Testing surfaced a real, pre-existing race in the app's auth flow, unrelated to this
phase's code: navigating cold (fresh tab, no prior page load) straight to a
`/dashboard/**` URL sometimes bounces to `/sign-in` even with a valid session in
`localStorage`, because `useRequireAuth()`'s redirect check can run before
`useSession()`'s `localStorage` hydration completes. Loading any page first (e.g. `/`)
and then navigating client-side avoids it, which is what a real user's browsing
pattern looks like anyway — nobody deep-links cold into a dashboard page as their
very first action on the site — but it's a real gap in `features/auth/store.ts`'s
hydration timing worth fixing whenever real auth (already-planned future work per
`AUTH.md`) replaces this localStorage-based session. Not fixed in this phase since
it's pre-existing and outside Feedback's scope, but flagged rather than quietly
worked around.

## What changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | Added `Feedback`, `FeedbackType`, `FeedbackStatus` |
| `lib/comms/templates/feedback-ack.ts` | New — registered in `lib/comms/templates/index.ts` |
| `app/api/feedback/route.ts` | New — `GET` (`?email=` own submissions / `?staffEmail=` all) / `POST` (submit + log + acknowledge) |
| `app/api/feedback/[id]/route.ts` | New — `PATCH` (staff-only status transition) |
| `features/feedback/` | New — `types.ts`, `constants.ts`, `services/feedback-service.ts`, `hooks.ts` |
| `app/dashboard/feedback/page.tsx` | New — customer submission form + own-history list |
| `app/dashboard/admin/feedback/page.tsx` | New — staff triage queue with status filter/change |
| `features/dashboard/{types,constants}.ts` | Added a `message` icon key; added "Feedback" to `dashboardNav` |
| `app/dashboard/admin/layout.tsx` | Added "Feedback" to the admin sub-nav |

## Verification

**Backend, via curl against the live server/database** (same rigor as every prior
phase): submitted one `FEEDBACK` and one `COMPLAINT`, confirmed both listed under the
customer's own `?email=` view, confirmed the staff `?staffEmail=` view saw both with
customer email attached, confirmed a non-staff `staffEmail` got 403, confirmed
`PATCH .../[id]` moved status to `IN_PROGRESS` and the `?status=IN_PROGRESS` filter
then returned exactly that one item, and confirmed both `FEEDBACK_SUBMITTED`/
`COMPLAINT_FILED` interactions plus two `SKIPPED_NO_CONSENT` acknowledgement
`MessageLog` rows (no consent granted) were recorded correctly.

**UI, via real browser (Claude in Chrome), for the first time this build**:

```
/dashboard/feedback — signed in as a real session:
  - Feedback/Complaint toggle, 5-star picker, subject + details fields all
    functioned correctly (confirmed via find()-located refs after an initial
    coordinate-based attempt revealed stale-coordinate issues across
    sequential clicks — a test-tooling artifact, not an app bug)
  - Submitting produced a live toast ("Thanks for the feedback") and the new
    item appeared immediately in "Your submissions" with correct subject,
    body, "Open" badge, and "Just now" timestamp

/dashboard/admin/feedback — same session (also staff):
  - Status-filter pills and the per-item status Select both rendered and
    functioned correctly once located precisely (same stale-coordinate
    lesson); changing status to "In progress" updated the badge, persisted
    to the database (confirmed via direct query), and correctly appeared
    when filtering by that status
```

Test feedback item, its `FEEDBACK_SUBMITTED` interaction, and its acknowledgement
`MessageLog` row were deleted afterward. `npm run verify` (typecheck + lint + 67
tests + build) is green.

## What's next

**Phase 8 — Data Portability**: JSON export of everything a customer's data now spans
(profile, consent, chat history, message log, feedback) — and, per your explicit
sign-off when this was scoped, making the dashboard settings page's currently-fake
"Delete account" button actually delete something.
