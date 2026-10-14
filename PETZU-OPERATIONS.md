# PetZu operations runbook

How to run the live site day to day: the admin area, team alerts on
WhatsApp and email, exports, and the settings each feature needs. Settings
are Vercel environment variables (Project > Settings > Environment
Variables, Production), and every change needs a redeploy.

## 1. Admin area (`/admin`)

| Setting | Value |
|---|---|
| `ADMIN_EMAILS` | Comma-separated emails allowed in, e.g. `owner@thepetzu.com,ops@thepetzu.com` |
| `ADMIN_PASSWORD` | One long random password (20+ characters) shared only with those people |
| `ADMIN_SESSION_SECRET` | Optional. Separate signing key; otherwise derived from the password |

- Sign in at `https://thepetzu.com/admin` with an allowed email and the password.
  Sessions last 12 hours. Without `ADMIN_PASSWORD`, nobody can sign in.
- To remove someone: delete their email from `ADMIN_EMAILS` and redeploy. To sign
  everyone out: change `ADMIN_PASSWORD` (or `ADMIN_SESSION_SECRET`) and redeploy.
- Pages: Overview, Enquiries & bookings, Customers, Community (hide/restore),
  Knowledge base (what the chat assistant knows), Exports.

Security model: every admin API checks a signed, HttpOnly, Secure,
SameSite=Strict cookie (`lib/auth/admin-session.ts`). Customer sign-in is
still a front-end placeholder, so it grants no admin access and no access to
anyone else's data.

## 2. Team alerts on WhatsApp and email

Every new booking request, enquiry, partner request, complaint, feedback and
community question sends a one-line alert with a link to the admin page
(`lib/comms/team-alert.ts`). Alerts go out after the customer's page has
responded, and a failed alert never fails the customer's submission.

### WhatsApp (Meta WhatsApp Cloud API)

1. In Meta Business Manager, set up WhatsApp with a business phone number
   (not one already used in the WhatsApp app). Note the **Phone number ID**
   and create a **permanent access token** (System user, `whatsapp_business_messaging`).
2. WhatsApp Manager > Message templates > Create:
   - Name: `team_alert` · Category: **Utility** · Language: **English**
   - Body: `New on PetZu: {{1}}`
   - Sample for `{{1}}`: `New booking request: Wellness exam with Dr. Meera Rao | From Asha <asha@example.com> | https://thepetzu.com/admin/feedback`
   Submit and wait for approval (usually minutes).
3. Set in Vercel:

| Setting | Value |
|---|---|
| `WHATSAPP_ACCESS_TOKEN` | Permanent token from step 1 |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID from step 1 |
| `TEAM_WHATSAPP_NUMBERS` | Team members' WhatsApp numbers, comma-separated, e.g. `919876543210` |
| `TEAM_ALERT_TEMPLATE` | Optional; defaults to `team_alert` |
| `TEAM_ALERT_TEMPLATE_LANGUAGE` | Optional; defaults to `en` |

Each team number must be able to receive WhatsApp messages; nothing else is
needed on their side. Meta charges per business-initiated conversation.

### Email

| Setting | Value |
|---|---|
| `RESEND_API_KEY` | From resend.com (verify the sending domain there) |
| `RESEND_FROM_EMAIL_TRANSACTIONAL` | e.g. `PetZu <care@thepetzu.com>` |
| `TEAM_ALERT_EMAILS` | Where alerts go, comma-separated |

## 3. "WhatsApp us" for customers

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits with country code, e.g.
`919876543210`). A green "Message us on WhatsApp" button appears on Contact and
a "WhatsApp us" link in the chat widget; both open a chat with a message
already typed. No API account is needed for this.

## 4. Exports

Admin > Exports downloads CSV (opens in Excel and Google Sheets) or JSON for
booking requests, enquiries, customers, community questions and answers,
chats, newsletter subscribers, consents and messages sent. Values are
escaped so spreadsheet formulas typed by customers never run.

## 5. Data requests (export or delete a customer)

Customers ask from Dashboard > Settings; the request arrives in Enquiries as
"Data request: ...". Reply from the team inbox to the customer's email to
confirm it is them, then open Admin > Customers > (customer) > Data requests
to download their data or delete them. Deletion removes every linked record.

## 6. Other settings

| Setting | Effect |
|---|---|
| `DATABASE_URL` | MongoDB Atlas connection. If the site can't save, check Atlas for a paused cluster (free tier) |
| `ANTHROPIC_API_KEY` | Full AI answers in the chat; without it the chat routes people to the right page |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-...`); nothing loads when unset |
| `NEXT_PUBLIC_ANNOUNCEMENT` | Banner under the navbar, e.g. a free-shipping message |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_BUSINESS_EMAIL` | Shown on Contact and Partners |
