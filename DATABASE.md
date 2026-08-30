# Database — setup, operations, and client access

The app uses **MongoDB Atlas** (managed MongoDB) through **Prisma**.
`prisma/schema.prisma` is the single source of truth for the 11 collections:
`Customer`, `Interaction`, `Consent`, `KnowledgeArticle`, `ChatConversation`,
`ChatMessage`, `Note`, `Tag`, `CustomerTag`, `MessageLog`, `Feedback`.

---

## 1. One-time Atlas setup

Done once in the [Atlas console](https://cloud.mongodb.com) (project
**thepetzu-world**, cluster **Cluster0**, free M0 tier):

1. **Network Access → IP Access List** → add `0.0.0.0/0`.
   Vercel's serverless functions don't have fixed IPs, so the database has to
   accept connections from anywhere. It stays protected by the database
   user's password — that is the real access boundary.

2. **Database Access → Database Users** → add user
   - Username: `petzu_app`
   - Password: use *Autogenerate Secure Password* and store it in the
     password manager / Vercel only — it is never committed.
   - Privileges: *Read and write to any database*.

3. **Clusters → Connect → Drivers (Node.js)** → copy the connection string and
   add the database name after the host:

   ```
   mongodb+srv://petzu_app:<PASSWORD>@cluster0.xxxxx.mongodb.net/petzu?retryWrites=true&w=majority
   ```

4. Put that string in **Vercel → Settings → Environment Variables** as
   `DATABASE_URL` (all environments), and in a local `.env` for running the
   commands below.

## 2. Pushing the schema

MongoDB has no migration history, so the schema is pushed directly:

```bash
npx prisma db push     # creates/updates collections + indexes to match schema.prisma
npm run db:seed         # loads KnowledgeArticle rows from the static FAQ content
```

Re-run `db push` after any edit to `prisma/schema.prisma`. The seed is
idempotent — safe to run again, it skips rows that already exist.

Inspect data locally any time with:

```bash
npx prisma studio      # opens a table browser on http://localhost:5555
```

## 3. What writes to the database

| Path | Writes |
|---|---|
| Contact / feedback form | `Feedback`, `Interaction`, `Customer` |
| Consent banner + `/account` consent controls | `Consent`, `Interaction` |
| Chat widget | `ChatConversation`, `ChatMessage` |
| `/dashboard/admin/knowledge` | `KnowledgeArticle` |
| `/dashboard/admin/customers/[id]` | `Note`, `Tag`, `CustomerTag` |
| Any outbound email/SMS/WhatsApp attempt | `MessageLog` |

Cart, wishlist and the signed-in session are **not** here — they live in the
browser's `localStorage` until real authentication exists (`AUTH.md` §8).

## 4. Giving the client access to the data

### Option A — the admin dashboard (recommended, non-technical)

The app already ships a staff area at **`/dashboard/admin`**:

- **Customers** — every person who has interacted, with their profile,
  consent state, chat history, notes and tags
- **Feedback & complaints** — a triage queue with status controls
- **Knowledge base** — the Q&A the chatbot answers from, editable in place

To grant a person access, add their email to the `ADMIN_EMAILS` environment
variable in Vercel (comma-separated), then redeploy. They:

1. Go to `thepetzu.com` → **Sign in** with that same email (any password —
   auth is not real yet).
2. Open **`/dashboard`** → the **Admin** section appears.

`ADMIN_EMAILS` is checked server-side on every staff write route
(`lib/auth/is-staff.ts`), so an email that isn't listed can't change anything
even if it reaches the pages.

### Option B — Atlas read-only access (technical)

For someone who wants the raw collections: **Atlas → Project → Access
Manager → Invite to Project**, role **Project Data Access Read Only**. They
browse documents under **Database → Browse Collections** and can build charts
under **Charts**.

## 5. Backups

Atlas M0 (free tier) does not include automated backups. Before a data-heavy
launch, either upgrade the cluster to M10+ (continuous backup) or schedule a
periodic `mongodump` — noted as pre-launch follow-up work.
