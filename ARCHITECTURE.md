# The PetZu World — Project Foundation

This document explains the architecture set up in this milestone. **No pages
were built** — this is infrastructure only: theming, layout primitives,
reusable UI variants, routing skeleton, and tooling. Page content is the next
milestone.

---

## 1. Why this folder structure?

The structure separates code by **what it does**, not by **what feature it
belongs to** at the top level, with one exception (`features/`) that
separates by **domain** once a slice of the app is large enough to earn its
own home. This hybrid is the same shape used by most production Next.js
codebases at mid-to-large companies:

- Cross-cutting concerns (`components/`, `hooks/`, `utils/`, `types/`,
  `constants/`, `services/`) live at the top level because *everything*
  depends on them. Burying `Button` inside a feature folder would force
  every other feature to reach across feature boundaries to use it.
- Domain-specific concerns will live inside `features/<domain>/` once real
  features exist, so a feature can be deleted or rewritten without hunting
  for its pieces scattered across the repo.
- `app/` stays a thin routing layer — folders and route groups only, no
  business logic. Pages will import from the other folders, not the other
  way around.

This gives one rule that resolves every "where does this file go?" question:
*if two or more features need it, it goes in a top-level folder; if only one
feature needs it, it goes in that feature's folder.*

## 2. Why is this architecture production-ready?

Because it optimizes for the properties that matter once a codebase has more
than one contributor and more than one release:

- **Predictability** — every file's location is derivable from its role, not
  from tribal knowledge. A new engineer can guess correctly where to add
  code on day one.
- **No duplication** — a single `cn()` helper, a single `Button`, a single
  color token set. Variants are parameters (`variant="outline"`), not copies
  of a component.
- **Single source of truth for design decisions** — colors, spacing, type
  scale, and container widths are CSS variables in one place
  ([styles/theme.css](styles/theme.css),
  [styles/typography.css](styles/typography.css),
  [styles/spacing.css](styles/spacing.css)). A rebrand or contrast fix is a
  one-file change, not a find-and-replace across hundreds of components.
- **Type safety end to end** — TypeScript strict mode, typed variant props
  via `class-variance-authority`, typed navigation/site config.
- **Compiles clean** — `npm run build` and `npm run lint` both pass with
  zero errors/warnings on this foundation (verified after every change in
  this milestone).
- **Deletable features** — because domain code will be isolated in
  `features/<domain>/`, removing a feature is a folder deletion, not a
  multi-file archaeology dig.
- **Themeable without a rewrite** — dark/light mode, brand color, and
  typography are token-driven, so visual changes don't touch component
  logic.

## 3. Why these libraries?

| Library | Why |
|---|---|
| **Next.js App Router** | Server components by default, file-system routing, built-in metadata API for SEO, route groups for organizing without affecting URLs. |
| **TypeScript** | Compile-time safety across component props, API responses, and route params — the difference between a caught bug and a production incident. |
| **Tailwind CSS v4** | CSS-first configuration (`@theme` in real CSS, no `tailwind.config.js` indirection), utility classes keep styling colocated with markup, and the design tokens defined here become real utility classes (`bg-primary`, `text-heading-1`, `py-section`). |
| **shadcn/ui conventions** (`components.json`, CVA-based primitives) | Not a component *library* dependency — it's a pattern: own the component source, style it with tokens, never fight an opaque npm package's CSS. `Button`/`Card`/`Badge` here follow this convention exactly. |
| **class-variance-authority (CVA)** | Type-safe variant APIs (`variant`, `size`) for components instead of prop-drilled boolean soup or hand-written conditional class strings. |
| **clsx + tailwind-merge** | `clsx` composes conditional classes; `tailwind-merge` resolves conflicts when a consumer overrides a utility (e.g. passing `className="px-8"` to a component that already sets `px-4` — last one wins predictably instead of both applying). |
| **tw-animate-css** | Tailwind v4's replacement for the old `tailwindcss-animate` plugin — ships `animate-in`/`fade-in-*`/`slide-in-from-*` utilities used for micro-interactions without hand-rolled keyframes. |
| **Framer Motion** | Declarative, interruption-safe animation for anything CSS keyframes can't express cleanly — staggered lists, exit animations (mobile menu), gesture-driven UI. Shared variants live in [constants/animations.ts](constants/animations.ts) so timing/easing stays consistent app-wide. |
| **Lucide Icons** | Tree-shakeable, consistent 24×24 stroke icon set with an enormous catalog and first-class React/TypeScript support. |
| **next-themes** | Handles the hard parts of dark mode correctly: no flash-of-wrong-theme on load, syncs with OS preference, persists user choice — reimplementing this is a well-known footgun. |

## 4. Why are components separated this way?

```
components/
  ui/          shadcn-style primitives: Button, Card, Badge, Skeleton
  layout/      structural/composition components: Navbar, Footer, Section, Container
  providers/   context providers composed once at the root
  skeletons/   loading states composed FROM ui/ primitives
```

- **`ui/`** components know nothing about the app. `Button` has no idea
  "PetZu" exists — it just renders a styled, accessible button. This is what
  makes it reusable in literally any future feature.
- **`layout/`** components know about the app (they import `siteConfig`,
  `primaryNav`) but not about any specific *page's* content. `Navbar` is the
  same on every route.
- **`providers/`** is separated because provider composition is a distinct
  concern from rendering — `AppProviders` is the *only* thing `app/layout.tsx`
  needs to know about for context setup, so adding a new provider (analytics,
  auth) never touches the layout file again.
- **`skeletons/`** compose `ui/` primitives (`Skeleton`, `Card`) rather than
  duplicating their markup, so a change to `Card`'s padding automatically
  keeps its skeleton visually aligned.

This mirrors the **atomic-ish layering** used across most production design
systems: primitives → composed layout → app-aware composition, each layer
only depending on the ones below it, never sideways or upward.

## 5. Why is this better than a beginner React project?

A beginner project typically has:

- Colors and spacing as magic hex codes and pixel values scattered through
  every component (`#ff6600`, `padding: 23px`).
- One giant `App.js` with all logic, styling, and markup interleaved.
- Copy-pasted button/card markup with slightly different classes each time
  ("button", "button2", "btn-final").
- No dark mode, or dark mode bolted on with `if (darkMode) ... : ...` in
  every component.
- No route organization — every page is a flat file with no shared layout
  contract.
- No type safety on props, so a typo in a prop name fails silently at
  runtime instead of at compile time.

This foundation instead has: **zero hardcoded colors** (everything is a CSS
variable), **zero duplicated component markup** (variants via CVA), **one
place to change global spacing/typography**, **type-checked component
props**, and **a routing skeleton that scales to dozens of pages** without
restructuring. The difference isn't cosmetic — it's the difference between a
codebase that gets *harder* to change as it grows versus one that stays
tractable.

## 6. Folder-by-folder reference

| Folder | Purpose |
|---|---|
| [`app/`](app) | Next.js App Router routes. Route groups (`(marketing)`, `(shop)`, `(community)`, `(legal)`, `(auth)`) organize URLs by domain without adding path segments. Currently folders only — no `page.tsx` files inside them yet. |
| [`components/ui/`](components/ui) | Framework-agnostic, app-agnostic primitives: `Button`, `Card`, `Badge`, `Skeleton`. |
| [`components/layout/`](components/layout) | Structural components: `Navbar`, `Footer`, `Section`, `Container`, `Logo`, `ThemeToggle`. |
| [`components/providers/`](components/providers) | `ThemeProvider` and the `AppProviders` composition root. |
| [`components/skeletons/`](components/skeletons) | Loading-state components built from `ui/` primitives (`CardSkeleton`, `CardGridSkeleton`, `TextSkeleton`). |
| [`features/`](features) | Empty by design — one subfolder per domain (`features/shop`, `features/community`, …) once real features are built. See [features/README.md](features/README.md). |
| [`hooks/`](hooks) | Reusable stateful logic: `useMounted`, `useMediaQuery`, `useScrollPosition`. |
| [`services/`](services) | API access layer. `apiClient` is the single fetch wrapper every feature's data layer will build on. |
| [`types/`](types) | Shared TypeScript types (`BaseComponentProps`, `NavItem`, `NavSection`, `AsyncStatus`). |
| [`constants/`](constants) | App-wide static data: `siteConfig`, `primaryNav`, `footerNav` ([site.ts](constants/site.ts)), `routes` ([routes.ts](constants/routes.ts)), SEO metadata builders ([seo.ts](constants/seo.ts)), Framer Motion variants ([animations.ts](constants/animations.ts)). |
| [`utils/`](utils) | Pure helper functions. Currently `cn()` — the class-merging helper every styled component uses. |
| [`styles/`](styles) | Design-token CSS imported into `app/globals.css`: `theme.css` (colors/radius/fonts), `typography.css` (type scale), `spacing.css` (semantic spacing), `container.css` (responsive container), `animations.css` (brand keyframes). |
| [`public/`](public) | Static assets served as-is (favicons, SVGs). |

## 7. Configuration files, one by one

| File | Purpose |
|---|---|
| [`package.json`](package.json) | Dependency manifest and `dev`/`build`/`start`/`lint` scripts. |
| [`tsconfig.json`](tsconfig.json) | TypeScript compiler config. Strict mode is on; `@/*` path alias maps to the project root so imports read `@/components/ui/button` instead of `../../../components/ui/button`. |
| [`next.config.ts`](next.config.ts) | Next.js build/runtime configuration. Currently defaults — extended later for image domains, redirects, etc. as needed. |
| [`eslint.config.mjs`](eslint.config.mjs) | Flat ESLint config extending `eslint-config-next`'s Core Web Vitals and TypeScript rulesets — catches accessibility issues, hook-rule violations, and Next.js-specific footguns at commit time, not in code review. |
| [`postcss.config.mjs`](postcss.config.mjs) | Registers the Tailwind v4 PostCSS plugin so `@import "tailwindcss"` in CSS is processed. |
| [`components.json`](components.json) | shadcn/ui CLI config — declares where generated primitives, the `cn` util, and hooks live (`@/components/ui`, `@/utils/cn`, `@/hooks`) so future `npx shadcn add <component>` calls drop files into the right folders automatically. |
| [`.gitignore`](.gitignore) | Excludes `node_modules`, `.next`, env files, and build artifacts from version control. |

## 8. Every dependency, explained

**Runtime:**
- `next` — the framework (App Router, routing, bundling, SSR/SSG).
- `react` / `react-dom` — UI runtime, React 19.
- `next-themes` — dark/light/system theme management without hydration
  flicker.
- `framer-motion` — animation library for React.
- `lucide-react` — icon components.
- `class-variance-authority` — typed variant class generation for
  `Button`/`Card`/`Badge`.
- `clsx` — tiny conditional class-name composer.
- `tailwind-merge` — resolves conflicting Tailwind classes so overrides
  behave predictably.
- `tw-animate-css` — Tailwind v4 animation utility classes.
- `@radix-ui/react-slot` — powers `Button`'s `asChild` prop, letting it
  render as a different element (e.g. `next/link`'s `Link`) while keeping
  its styling and behavior.

**Development:**
- `typescript` — the language/compiler.
- `@types/node`, `@types/react`, `@types/react-dom` — type definitions for
  Node and React APIs.
- `tailwindcss`, `@tailwindcss/postcss` — the CSS engine and its PostCSS
  integration.
- `eslint`, `eslint-config-next` — linting and Next.js-specific rules.

## 9. Project architecture (ASCII)

```
                              ┌────────────────────────┐
                              │        app/             │
                              │  routes (App Router)    │
                              │  route groups only —    │
                              │  no pages yet            │
                              └───────────┬─────────────┘
                                          │ imports
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
          ┌──────────────────┐ ┌───────────────────┐ ┌────────────────────┐
          │  components/       │ │   features/         │ │   constants/         │
          │  ┌───────────────┐ │ │  (empty for now,    │ │  siteConfig, routes,│
          │  │ providers/    │ │ │   one folder per     │ │  seo, animations     │
          │  │ (theme, etc.) │ │ │   domain later)      │ └──────────┬──────────┘
          │  └───────────────┘ │ └───────────────────┘             │
          │  ┌───────────────┐ │                                    │
          │  │ layout/       │◄├────────────────────────────────────┘
          │  │ Navbar/Footer │ │           reads nav + site data
          │  │ Section/      │ │
          │  │ Container     │ │
          │  └───────┬───────┘ │
          │          │ uses     │
          │  ┌───────▼───────┐ │
          │  │ ui/           │ │
          │  │ Button/Card/  │ │
          │  │ Badge/Skeleton│ │
          │  └───────┬───────┘ │
          │          │ uses     │
          │  ┌───────▼───────┐ │
          │  │ skeletons/    │ │
          │  └───────────────┘ │
          └──────────┬─────────┘
                     │ all of the above use
        ┌────────────┼────────────┬───────────────┐
        ▼            ▼            ▼               ▼
  ┌──────────┐ ┌───────────┐ ┌──────────┐  ┌─────────────┐
  │ hooks/   │ │ utils/     │ │ types/   │  │ services/    │
  │ (mount,  │ │ cn()       │ │ shared   │  │ apiClient    │
  │ scroll,  │ │            │ │ types    │  │              │
  │ media)   │ │            │ │          │  │              │
  └──────────┘ └───────────┘ └──────────┘  └─────────────┘

  ┌───────────────────────────────────────────────────────┐
  │  styles/ (theme, typography, spacing, container,       │
  │  animations)  ──▶  app/globals.css  ──▶  Tailwind v4    │
  │  @theme  ──▶  utility classes (bg-primary, text-        │
  │  heading-1, py-section, container, animate-*)           │
  └───────────────────────────────────────────────────────┘
```

**Dependency direction is strictly downward/leftward in this diagram** —
`app/` depends on `components/`, `features/`, and `constants/`;
`components/` depends on `hooks/`, `utils/`, `types/`, `services/`; nothing
at the bottom ever imports from the top. That invariant is what keeps the
codebase from turning into a dependency tangle as it grows.

## 10. What's next

The next milestone builds actual page content inside the route-group
folders already scaffolded in `app/` (`(marketing)/about`, `(shop)/shop`,
`(community)/community`, etc.), composing the primitives documented above.
No new architectural decisions should be needed for that — this foundation
is the contract pages build against.
