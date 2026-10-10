# Phase 3: Pet health records, medicines and reminders (design)

Status: **proposed, not built.** Covers the "Note" and "IMP" parts of client
feedback point 13. The chat part of point 13 and the promotions/service
sender split already shipped (see git log).

---

## 1. What the client asked for

| # | Ask | Plain-English summary |
|---|---|---|
| A | Pre-visit upload | Upload what the pet is going through: notes, scans, blood work. Partner vets see it before the appointment ("appointment notes"). |
| B | Post-visit prescription | Upload the prescription after a visit. For partner vets it should appear automatically. |
| C | Easy access | A button in the navbar, and a floating shortcut while scrolling. |
| D | Buy medicines | Read the prescription and suggest trusted nearby providers that stock the medicines. |
| E | Medicine schedule | A tab listing the pet's medicines, with morning/evening reminders ("don't forget Bruno's medicine"). |
| F | Appointment reminder | "Tomorrow: appointment at 4 PM with Dr X." |
| G | Post-visit message | "Add the prescription to PetZu so you don't lose it, buy medicines here." |
| H | Grooming nudge | Every 3 weeks after a spa booking: "Your pet's grooming time is near." |
| I | Two senders | Promotions from one number, service messages from another. **Done** (`lib/comms/sender-identity.ts`). |
| J | Email too | Same reminders by email, also usable for marketing. |

## 2. Why this can't ship as a UI-only change

Today the site has no real backend for these flows:

1. **Login is not real.** `features/auth/store.ts` accepts any password and
   keeps the session in the browser. Medical records behind a fake login
   would be readable by anyone who types the owner's email. **Real
   authentication (email/phone OTP) is a hard prerequisite.**
2. **Bookings aren't saved.** The booking flow ends on a success page; no
   appointment is stored, so there is nothing to remind anyone about.
3. **No file storage.** Scans and prescriptions need private, encrypted
   storage with signed, expiring links, not the database or the browser.
4. **No scheduler.** Reminders need something that runs on a timer.
5. **Health data is sensitive personal data.** Under India's DPDP Act 2023
   we need explicit, specific consent for storing it, a way to delete it,
   and access limited to the owner and the vet they choose to share with.

## 3. Proposed architecture

```
Browser ──> Next.js API routes ──> MongoDB (Prisma)
                 │                    ├─ Pet, HealthRecord, Medication, Reminder, Appointment
                 │                    └─ existing Customer, Consent, MessageLog
                 ├──> Vercel Blob (private) for scans/prescriptions
                 ├──> Claude (vision) to read prescriptions into a medicine list
                 └──> lib/comms sendMessage() (consent-gated, logged)
Vercel Cron (every 15 min) ──> /api/cron/reminders ──> due Reminder rows ──> sendMessage()
```

New data (Prisma, MongoDB):

- `Pet`: replaces the per-device profiles from phase 2 once accounts are real.
- `Appointment`: provider, pet, time, status; written by the booking flow.
- `HealthRecord`: type (`PRE_VISIT_NOTE`, `SCAN`, `LAB_RESULT`, `PRESCRIPTION`), file key, notes, `sharedWithProviderIds`.
- `Medication`: name, dose, times of day, start/end date, source record.
- `Reminder`: what, when (`dueAt`), channel, purpose, status; one row per send.

Reminders are rows, not timers: the cron picks up `dueAt <= now AND status = PENDING`,
sends via the existing dispatcher (which already checks consent and logs every
message), and marks the row sent. Restarts and deploys can't lose a reminder, and
every send is auditable in `MessageLog`.

## 4. Delivery plan

| Phase | Scope | Depends on | Estimate |
|---|---|---|---|
| 3.0 | Real auth (OTP), save bookings as `Appointment`, migrate pet profiles to the account | SMS/email provider keys | 4 to 5 days |
| 3.1 | Reminders: F (appointment, day before + 2h before), G (post-visit), H (grooming every 3 weeks); email + SMS; Vercel Cron | 3.0, DLT templates approved | 3 days |
| 3.2 | Health records: A + B upload, list and share with a vet; navbar entry + floating button (C); consent and deletion | 3.0, Vercel Blob | 4 days |
| 3.3 | Medicine schedule (E) with morning/evening reminders; prescription reading with Claude vision to pre-fill the list, user confirms before saving | 3.1, 3.2 | 3 days |
| 3.4 | Buy medicines (D): match the list to partner pharmacies near the user | Partner pharmacy list from the client | 2 to 3 days once data exists |
| 3.5 | Partner-vet auto-upload of prescriptions (B for partners) | A partner vet portal or integration | Separate scope |

Each phase ships behind its own tests and is usable on its own.

## 5. Decisions needed from the client

1. **SMS provider and DLT.** MSG91 is wired in. Please register two DLT headers
   (one promotional, one transactional) and the reminder templates; approval takes
   a few days, so start now.
2. **WhatsApp** for reminders as well as SMS? (Cheaper per message, needs approved templates.)
3. **Storage budget** for scans: Vercel Blob is simplest; S3 if they prefer AWS.
4. **Partner pharmacies** for "buy medicines": names, locations, and whether
   ordering happens on PetZu or by redirect.
5. **Partner vets**: how will a vet see pre-visit notes and upload prescriptions?
   (Simple vet login on PetZu is the usual first step.)
6. **Reminder timing**: confirm "day before at 6 PM + 2 hours before" for
   appointments and the 3-week grooming cycle.

## 6. Safety notes

- PetZu never changes medication doses; the prescription-reading step only pre-fills
  what's written, and the owner confirms every line.
- Medicine reminders are TRANSACTIONAL and go from the service sender; nothing
  health-related is ever sent from the promotional sender.
- Every reminder honours the existing consent records; customers can switch any
  channel off in `/dashboard/settings`.
