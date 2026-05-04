# Power — Gym Owner App: Detailed Overview Summary

> Generated: May 4, 2026  
> Purpose: Full project audit — architecture, weekly build log, per-file reference, data flows, and flaw inventory

---

## Table of Contents

1. [Project Purpose & Architecture](#1-project-purpose--architecture)
2. [Week-by-Week Build Log](#2-week-by-week-build-log)
3. [Per-File Reference](#3-per-file-reference)
4. [Data Flow Diagrams](#4-data-flow-diagrams)
5. [Flaw Inventory](#5-flaw-inventory)

---

## 1. Project Purpose & Architecture

### What it is

Power is a web app for independent gym owners to centralize member workout tracking, analytics, and AI-assisted coaching. It replaces scattered notes and spreadsheets with a single focused tool.

**Demo login:** `rob@launchpadphilly.org` / `password123`

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | TailwindCSS + Framer Motion |
| Accessible UI | HeadlessUI, React Aria |
| ORM | Prisma 7 |
| Database | PostgreSQL 16 |
| Auth | Custom session-based (HttpOnly cookies, bcrypt) |
| Testing | Vitest |
| Runtime | Docker + Docker Compose |

### Folder Structure

```
Power/
├── app/                         # Next.js App Router pages + API routes
│   ├── (auth)/login/page.tsx    # Login page
│   ├── dashboard/page.tsx       # Main dashboard (auth-protected)
│   ├── workouts/page.tsx        # Workout log + history (auth-protected)
│   ├── analytics/page.tsx       # Analytics trends (auth-protected)
│   ├── ai/page.tsx              # AI coaching insights (auth-protected)
│   ├── profile/page.tsx         # User profile (auth-protected)
│   ├── api/auth/login/          # POST: authenticate user
│   ├── api/auth/logout/         # POST: destroy session
│   └── api/workouts/            # POST/PATCH/DELETE: workout CRUD
│
├── components/
│   ├── AppShell.tsx             # Shared layout + nav (desktop + mobile)
│   ├── Navbar.tsx               # ⚠️ UNUSED — orphaned component
│   ├── screens/                 # Full-page screen components
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── WorkoutsScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── AIScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── ui/
│       └── MotionButton.tsx     # Reusable animated button
│
├── lib/
│   ├── auth.ts                  # hashPassword / verifyPassword (bcrypt)
│   ├── session.ts               # getCurrentUser / requireUser / session helpers
│   ├── prisma.ts                # Prisma client singleton
│   ├── utils.ts                 # cn() class utility + sanitizeRedirectPath()
│   ├── workouts.ts              # Validation, parsing, DB operations (CRUD)
│   ├── auth.test.ts             # Unit tests: password hashing
│   ├── workouts.test.ts         # Unit tests: workout validation
│   └── actions/
│       └── workouts.ts          # Server Actions: createWorkout, updateWorkout, deleteWorkout
│
├── prisma/
│   ├── schema.prisma            # Database schema (User, Member, Workout, WorkoutItem, Session)
│   ├── seed.ts                  # DB seeder (Rob + 3 members)
│   └── migrations/              # Versioned SQL migration files
│
├── proxy.ts                     # Route protection proxy (Next.js v16 file convention)
├── docker-compose.yml           # App + PostgreSQL services
├── Dockerfile                   # Multi-stage production build
└── README.md                    # Project documentation
```

### Database Schema

```
User (gym owner)
 ├── id, email, password, name, role, createdAt, updatedAt
 ├── → members: Member[]
 ├── → workouts: Workout[]
 └── → sessions: Session[]

Member
 ├── id, email, name, age, goal, ownerId, createdAt, updatedAt
 └── → workouts: Workout[]

Workout
 ├── id, memberId, userId, date, notes, createdAt, updatedAt
 └── → items: WorkoutItem[]

WorkoutItem
 └── id, workoutId, exerciseName, sets, reps, weight, createdAt, updatedAt

Session
 └── id, userId, expiresAt, createdAt
```

**Relationships:**
- One `User` (gym owner) → many `Member` records
- One `User` → many `Workout` records (workouts they logged)
- One `Member` → many `Workout` records
- One `Workout` → many `WorkoutItem` records (one per exercise in that session)
- One `User` → many `Session` records

---

## 2. Week-by-Week Build Log

### Week 1 — Project Foundation

**Goal:** Problem definition, wireframes, project skeleton, Docker baseline, draft Prisma schema plan.

**What was created:**

| Item | Location |
|---|---|
| Business problem statement | [README.md](README.md) |
| Feature list (must-have / nice-to-have) | [README.md](README.md) |
| User journey (7 steps) | [README.md](README.md) |
| Wireframe screenshots (Login, Dashboard, Workouts, Analytics, AI) | `public/` |
| Starter Next.js project | Project root |
| `docker-compose.yml` (app + PostgreSQL) | [docker-compose.yml](docker-compose.yml) |
| `Dockerfile` (multi-stage build) | [Dockerfile](Dockerfile) |
| Draft Prisma schema plan | [README.md](README.md) — Draft Schema section |

**How it works:**

The Dockerfile uses a 4-stage build (`base → deps → builder → runner`) to produce a lean production image. `docker-compose.yml` wires the Next.js app to a PostgreSQL 16 container; the app waits for the DB healthcheck before starting.

---

### Week 2 Monday — Problem & Feature Refinement

**Goal:** Sharpen the problem statement, finalize feature scope, draft user journey.

**What was created/refined:**

| Item | Location |
|---|---|
| Refined problem statement (3–5 sentences) | [README.md](README.md) — Business Problem section |
| App purpose statement (1–2 sentences) | [README.md](README.md) — App Purpose section |
| Must-have vs. nice-to-have feature list | [README.md](README.md) — Feature List section |
| User journey draft (Login → Dashboard → Workouts → Analytics → AI → Profile) | [README.md](README.md) — User Journey section |

No code files were created this day — deliverables are documentation.

---

### Week 2 Tuesday — Starter Pages

**Goal:** Get the full page skeleton live: login, dashboard, workouts, analytics, AI.

**What was created:**

| File | What it does |
|---|---|
| [app/layout.tsx](app/layout.tsx) | Root layout wrapper (HTML/body, metadata: "Power Gym App") |
| [app/page.tsx](app/page.tsx) | Root route — immediately redirects to `/login` |
| [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) | Login page (no auth required) → renders `LoginScreen` |
| [app/dashboard/page.tsx](app/dashboard/page.tsx) | Dashboard stub → renders `DashboardScreen` |
| [app/workouts/page.tsx](app/workouts/page.tsx) | Workouts stub → renders `WorkoutsScreen` |
| [app/analytics/page.tsx](app/analytics/page.tsx) | Analytics stub → renders `AnalyticsScreen` |
| [app/ai/page.tsx](app/ai/page.tsx) | AI stub → renders `AIScreen` |
| [app/profile/page.tsx](app/profile/page.tsx) | Profile stub → renders `ProfileScreen` |
| [app/globals.css](app/globals.css) | TailwindCSS base + retro monospace theme (Courier Prime / IBM Plex Mono) |
| [components/AppShell.tsx](components/AppShell.tsx) | Shared layout with desktop nav + mobile bottom bar, logout, Framer Motion stagger |
| [components/screens/LoginScreen.tsx](components/screens/LoginScreen.tsx) | Login form UI with email, password, show/hide toggle |
| [components/screens/DashboardScreen.tsx](components/screens/DashboardScreen.tsx) | KPI cards + activity feed + quick actions |
| [components/screens/WorkoutsScreen.tsx](components/screens/WorkoutsScreen.tsx) | Workout log form + history list |
| [components/screens/AnalyticsScreen.tsx](components/screens/AnalyticsScreen.tsx) | Bar chart + session frequency + insights |
| [components/screens/AIScreen.tsx](components/screens/AIScreen.tsx) | Prompt builder + generated insights |
| [components/screens/ProfileScreen.tsx](components/screens/ProfileScreen.tsx) | Coach info + preferences form |
| [components/ui/MotionButton.tsx](components/ui/MotionButton.tsx) | Reusable animated button (primary / secondary / ghost) |

---

### Week 3 Monday — Prisma Schema

**Goal:** Install Prisma, define all four core models, configure DB connection.

**What was created:**

| File | What it does |
|---|---|
| [prisma/schema.prisma](prisma/schema.prisma) | Defines `User`, `Member`, `Workout`, `WorkoutItem`, `Session` models |
| [lib/prisma.ts](lib/prisma.ts) | Prisma client singleton (prevents multiple instances in hot-reload) |
| [prisma.config.ts](prisma.config.ts) | Prisma CLI config — schema path, migrations path, seed command, DB URL |

**Schema details:**

- `User` — gym owner account (id, email, password hash, name, role, timestamps)
- `Member` — a gym member owned by a `User` via `ownerId` FK
- `Workout` — a session linked to both a `Member` and a `User` (who logged it)
- `WorkoutItem` — a single exercise within a `Workout` (exerciseName, sets, reps, weight)
- `Session` — a login session row linked to a `User`, with `expiresAt` TTL

All relationships have `onDelete: Cascade` so deleting a user cleans up all their data.

---

### Week 3 Tuesday — Authentication

**Goal:** First migration, working login, session cookie, protected dashboard.

**What was created:**

| File | What it does |
|---|---|
| `prisma/migrations/20260427194648_init/` | First migration SQL — creates all 5 tables |
| `prisma/migrations/20260501173101_add_member_age_goal/` | Second migration SQL — adds `age` and `goal` fields to `Member` |
| [prisma/seed.ts](prisma/seed.ts) | Seeds DB: Rob (gym owner) + 3 members (Sarah L, Mike T, Adam K) |
| [lib/auth.ts](lib/auth.ts) | `hashPassword()` + `verifyPassword()` using bcryptjs (12 rounds) |
| [lib/session.ts](lib/session.ts) | `getCurrentUser()` + `requireUser()` — reads `power_session` cookie → DB lookup |
| [app/api/auth/login/route.ts](app/api/auth/login/route.ts) | POST: validate credentials → bcrypt verify → create Session row → set HttpOnly cookie |
| [app/api/auth/logout/route.ts](app/api/auth/logout/route.ts) | POST: delete Session row → clear cookie |
| [proxy.ts](proxy.ts) | ⚠️ Middleware (misnamed — should be `middleware.ts`) — checks `power_session` cookie on protected routes |
| [lib/auth.test.ts](lib/auth.test.ts) | Unit tests: hash/verify password |

**Auth flow:**

```
User submits login form
  → POST /api/auth/login (email + password)
  → Prisma: find user by email
  → bcrypt: compare password hash
  → If valid: insert Session row, set HttpOnly cookie "power_session" (24h TTL)
  → Redirect to /dashboard
  → If invalid: return 401, show error, no redirect

Protected page (e.g. /dashboard)
  → middleware checks for power_session cookie
  → Server Component calls requireUser() → reads cookie → DB lookup
  → If expired/missing: redirect to /login?from=/dashboard
```

---

### Week 4 Monday — Workout Create + Validation

**Goal:** Workout entry form, server-side validation, Prisma create, success/error state.

**What was created:**

| File | What it does |
|---|---|
| [lib/workouts.ts](lib/workouts.ts) | Types, parsers, validators, DB operations for workouts |
| [lib/actions/workouts.ts](lib/actions/workouts.ts) | Server Actions: `createWorkout`, `updateWorkout`, `deleteWorkout` |
| [app/api/workouts/route.ts](app/api/workouts/route.ts) | REST API parity: POST/PATCH/DELETE handlers using same shared helpers |
| [lib/workouts.test.ts](lib/workouts.test.ts) | Unit tests: all 3 validation functions (create, update, delete) |

**Validation rules:**
- `memberId` — required, non-empty string
- `exerciseName` — required, non-empty string
- `sets` — required, positive integer
- `reps` — required, positive integer
- `notes` — required, non-empty string
- `weight` — optional, valid float if provided
- `date` — optional, defaults to today if missing

**Create flow:**
```
WorkoutsScreen form submit
  → createWorkout server action (FormData)
  → validateWorkoutInput() → { errors, parsed }
  → if errors: return field-level errors to form UI
  → getCurrentUser() → ownership check (member belongs to this gym owner)
  → prisma.workout.create() with nested WorkoutItem
  → revalidatePath("/workouts") → history re-renders with new data
  → return { status: "success" }
```

---

### Week 4 Tuesday — Workout History (Read)

**Goal:** Display saved workouts from DB, readable layout, empty state.

**What was updated:**

| File | What changed |
|---|---|
| [app/workouts/page.tsx](app/workouts/page.tsx) | Added server-side data fetching: members query + workouts query (parallel) |
| [components/screens/WorkoutsScreen.tsx](components/screens/WorkoutsScreen.tsx) | Added workout history list, `WorkoutHistoryCard` sub-component, empty state |

**Query pattern:**
```typescript
const [members, workouts] = await Promise.all([
  prisma.member.findMany({ where: { ownerId: user.id }, orderBy: { name: "asc" } }),
  prisma.workout.findMany({
    where: { userId: user.id },
    include: { member: true, items: true },
    orderBy: { date: "desc" },
  }),
]);
```

Data flows: PostgreSQL → Prisma → Server Component → Client Component props → rendered history cards.

---

### Week 5 Monday — Full CRUD (Update + Delete)

**Goal:** Edit and delete existing workouts, UI refreshes after each change.

**What was created/updated:**

| File | What it does |
|---|---|
| [lib/workouts.ts](lib/workouts.ts) | Added `updateWorkoutForUser()` + `deleteWorkoutForUser()` DB functions |
| [lib/actions/workouts.ts](lib/actions/workouts.ts) | Added `updateWorkout` + `deleteWorkout` server actions with `revalidatePath` |
| [app/api/workouts/route.ts](app/api/workouts/route.ts) | Added PATCH + DELETE handlers (API parity with server actions) |
| [components/screens/WorkoutsScreen.tsx](components/screens/WorkoutsScreen.tsx) | Added edit toggle (date + notes), delete confirmation flow in `WorkoutHistoryCard` |

**Edit flow:**
```
User clicks Edit on a workout card
  → Edit form appears (date + notes only)
  → workoutId passed as hidden input
  → updateWorkout server action called via useActionState()
  → validateWorkoutUpdateInput() → ownership check via userId
  → prisma.workout.update() → revalidatePath("/workouts")
  → Edit form collapses, updated card appears
```

**Delete flow:**
```
User clicks Delete → confirmation prompt appears
  → User confirms → deleteWorkout server action
  → validateWorkoutDeleteInput() → ownership check
  → prisma.workout.delete() → revalidatePath("/workouts")
  → Card disappears from history
```

**Note:** Only `date` and `notes` can be edited — individual `WorkoutItem` records (exercise, sets, reps, weight) cannot be edited. See Flaw Inventory item B2.

---

## 3. Per-File Reference

### App Routes

| File | Purpose | Auth Required | Key Behavior |
|---|---|---|---|
| [app/page.tsx](app/page.tsx) | Root route | No | Redirects to `/login` |
| [app/layout.tsx](app/layout.tsx) | Root HTML wrapper | No | Sets metadata, wraps all pages |
| [app/globals.css](app/globals.css) | Global styles | N/A | Tailwind directives + retro monospace theme |
| [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) | Login page | No | Renders `LoginScreen` |
| [app/dashboard/page.tsx](app/dashboard/page.tsx) | Dashboard | Yes | `requireUser()` → renders `DashboardScreen` |
| [app/workouts/page.tsx](app/workouts/page.tsx) | Workouts | Yes | Fetches members + workouts → `WorkoutsScreen` |
| [app/analytics/page.tsx](app/analytics/page.tsx) | Analytics | Yes | `requireUser()` → renders `AnalyticsScreen` |
| [app/ai/page.tsx](app/ai/page.tsx) | AI Insights | Yes | `requireUser()` → renders `AIScreen` |
| [app/profile/page.tsx](app/profile/page.tsx) | Profile | Yes | `requireUser()` → renders `ProfileScreen` |

### API Routes

| File | Method | Purpose |
|---|---|---|
| [app/api/auth/login/route.ts](app/api/auth/login/route.ts) | POST | Authenticate user, set session cookie |
| [app/api/auth/logout/route.ts](app/api/auth/logout/route.ts) | POST | Delete session, clear cookie |
| [app/api/workouts/route.ts](app/api/workouts/route.ts) | POST | Create workout + WorkoutItem |
| [app/api/workouts/route.ts](app/api/workouts/route.ts) | PATCH | Update workout date + notes |
| [app/api/workouts/route.ts](app/api/workouts/route.ts) | DELETE | Delete workout + cascade items |

### Components

| File | Type | Purpose |
|---|---|---|
| [components/AppShell.tsx](components/AppShell.tsx) | Client | Shared layout: nav links, logout, mobile bar, Framer animations |
| [components/Navbar.tsx](components/Navbar.tsx) | Client | ⚠️ UNUSED — orphaned nav component; should be deleted |
| [components/ui/MotionButton.tsx](components/ui/MotionButton.tsx) | Client | Reusable button with hover/tap animations (primary/secondary/ghost) |
| [components/screens/LoginScreen.tsx](components/screens/LoginScreen.tsx) | Client | Email + password form, show/hide password, POST to `/api/auth/login` |
| [components/screens/DashboardScreen.tsx](components/screens/DashboardScreen.tsx) | Client | KPI cards ⚠️ HARDCODED, activity feed, quick action buttons |
| [components/screens/WorkoutsScreen.tsx](components/screens/WorkoutsScreen.tsx) | Client | Log form + history list with edit/delete per card |
| [components/screens/AnalyticsScreen.tsx](components/screens/AnalyticsScreen.tsx) | Client | Bar chart + insights ⚠️ FULLY MOCKED — zero DB connection |
| [components/screens/AIScreen.tsx](components/screens/AIScreen.tsx) | Client | Prompt builder + insights display ⚠️ NO LLM INTEGRATION |
| [components/screens/ProfileScreen.tsx](components/screens/ProfileScreen.tsx) | Client | Profile edit form ⚠️ Save is no-op — no backend |

### Lib

| File | Exports | Purpose |
|---|---|---|
| [lib/auth.ts](lib/auth.ts) | `hashPassword`, `verifyPassword` | bcrypt password utilities (12 rounds) |
| [lib/session.ts](lib/session.ts) | `getCurrentUser`, `requireUser`, `SESSION_COOKIE_NAME`, helpers | Session read + route protection |
| [lib/prisma.ts](lib/prisma.ts) | `prisma` | Prisma client singleton (PrismaPg adapter) |
| [lib/utils.ts](lib/utils.ts) | `cn`, `sanitizeRedirectPath` | Class name merge + open-redirect prevention |
| [lib/workouts.ts](lib/workouts.ts) | Validators, parsers, `saveWorkoutForUser`, `updateWorkoutForUser`, `deleteWorkoutForUser` | All workout business logic |
| [lib/actions/workouts.ts](lib/actions/workouts.ts) | `createWorkout`, `updateWorkout`, `deleteWorkout` | Server Actions consumed by `useActionState()` |
| [lib/auth.test.ts](lib/auth.test.ts) | — | Vitest: hash + verify tests |
| [lib/workouts.test.ts](lib/workouts.test.ts) | — | Vitest: all 3 validation function tests |

### Config

| File | Purpose |
|---|---|
| [proxy.ts](proxy.ts) | ⚠️ `export function proxy` — function was named `middleware` (v16 requires `proxy`); Next.js in `package.json` was also pinned to v15 |
| [prisma.config.ts](prisma.config.ts) | Prisma CLI config (schema path, seed command, DB URL) |
| [next.config.js](next.config.js) | Next.js config (reactStrictMode: true) |
| [tailwind.config.ts](tailwind.config.ts) | TailwindCSS content paths + HeadlessUI plugin |
| [tsconfig.json](tsconfig.json) | TypeScript strict mode, path alias `@/*` |
| [vitest.config.ts](vitest.config.ts) | Vitest config (jsdom env, globals, path alias) |
| [docker-compose.yml](docker-compose.yml) | App + PostgreSQL services |
| [Dockerfile](Dockerfile) | 4-stage production build |
| [package.json](package.json) | Dependencies + scripts |

---

## 4. Data Flow Diagrams

### Auth Flow

```
Browser                     Next.js App                       PostgreSQL
  |                              |                                 |
  |-- POST /api/auth/login ----→|                                 |
  |   { email, password }        |-- prisma.user.findUnique() -→  |
  |                              |←- user row (id, password) ---- |
  |                              |                                 |
  |                              | bcrypt.compare(password, hash)  |
  |                              |                                 |
  |                              |-- prisma.session.create() --→  |
  |                              |←- session row (id, expiresAt) -|
  |                              |                                 |
  |←- 200 Set-Cookie: ----------|
  |   power_session=<id>         |
  |   (HttpOnly, Secure, 24h)    |
  |                              |
  |-- GET /dashboard ----------→|
  |   Cookie: power_session      |-- prisma.session.findUnique()-→|
  |                              |-- prisma.user.findUnique() --→ |
  |                              |←- AuthenticatedUser ----------- |
  |←- 200 Dashboard page ------- |
```

### Workout CRUD Flow

```
WorkoutsScreen (Client)
  |
  |-- useActionState(createWorkout, initialState)
  |       |
  |       |-- form submit → FormData
  |              |
  |              ↓
  |       createWorkout(prevState, formData)  [Server Action]
  |              |
  |              ├── workoutInputFromFormData(formData)
  |              ├── validateWorkoutInput(input)
  |              │     ├── if errors → return { status: "error", errors }
  |              │     │     ↑ inline field errors render in UI
  |              │     └── if valid → parsed { memberId, exerciseName, sets, reps, weight, notes, date }
  |              |
  |              ├── getCurrentUser() → reads power_session cookie → DB lookup
  |              ├── prisma.member.findFirst({ where: { id, ownerId: userId } })
  |              │     └── if null → return { status: "error", message: "Member not found" }
  |              |
  |              ├── prisma.workout.create({
  |              │     data: { userId, memberId, date, notes,
  |              │       items: { create: [{ exerciseName, sets, reps, weight }] }
  |              │     }
  |              │   })
  |              |
  |              ├── revalidatePath("/workouts")
  |              └── return { status: "success" }
  |
  └── WorkoutsPage re-fetches from server → updated history renders
```

---

## 5. Flaw Inventory

This section documents every identified issue. Items are categorized and prioritized. Use this as a checklist for the refinement pass.

---

### 🔴 Critical Bugs

#### B1 — proxy.ts function export was wrong + project was on Next.js 15
- **File:** [proxy.ts](proxy.ts)
- **Problem:** `proxy.ts` IS the correct filename for Next.js v16 (Middleware was renamed to Proxy in v16.0.0). However, two issues existed: (1) the exported function was named `middleware` — Next.js v16 requires it to be named `proxy`; (2) `package.json` had `"next": "^15.5.15"` installed, and in v15 the active convention is still `middleware.ts`, so `proxy.ts` was silently ignored at runtime.
- **Impact:** The proxy layer was completely inert. Route protection worked only via `requireUser()` in Server Components.
- **Fix applied:** Renamed export from `middleware` to `proxy` in `proxy.ts`. Updated `package.json` to `"next": "^16.2.4"`. Run `npm install` to apply.

#### B2 — WorkoutItem editing not implemented
- **File:** [components/screens/WorkoutsScreen.tsx](components/screens/WorkoutsScreen.tsx), [lib/workouts.ts](lib/workouts.ts)
- **Problem:** The edit form in `WorkoutHistoryCard` only exposes `date` and `notes`. Exercise records (`WorkoutItem`: exerciseName, sets, reps, weight) have no edit path — no UI, no server action, no Prisma update. The only way to change an exercise is to delete the whole workout and re-enter it.
- **Fix:** Add `WorkoutItem` update fields to the edit form + `updateWorkoutItems` logic in `lib/workouts.ts`.

---

### 🟠 Mocked / Non-Functional Features

#### B3 — Analytics page is fully hardcoded
- **File:** [components/screens/AnalyticsScreen.tsx](components/screens/AnalyticsScreen.tsx)
- **Problem:** All values — bar chart data (84k → 102k volume), session frequencies (Mike T 4/wk), insights, recommendations — are static strings in the component. No DB queries, no real data.
- **Fix:** Build analytics query in `lib/` that aggregates `WorkoutItem.weight × sets × reps` per month and session counts per member.

#### B4 — Dashboard KPI cards are hardcoded
- **File:** [components/screens/DashboardScreen.tsx](components/screens/DashboardScreen.tsx)
- **Problem:** "Active Members: 47", "Workouts This Week: 126", "Avg. Attendance: 82%" are hardcoded strings. The dashboard page (`app/dashboard/page.tsx`) does not fetch any data.
- **Fix:** Add DB queries to `app/dashboard/page.tsx` for real member count and workout count; pass as props to `DashboardScreen`.

#### B5 — AI screen has no LLM integration
- **File:** [components/screens/AIScreen.tsx](components/screens/AIScreen.tsx)
- **Problem:** "Generate Insight" uses a `setTimeout(900)` fake delay and swaps in a second hardcoded array of strings. No API call is made.
- **Fix:** Requires an LLM API key (e.g. OpenAI). Implement a `/api/ai/insight` route that fetches the member's recent workouts and sends them to the LLM.

#### B6 — Profile "Save Profile" is a no-op
- **File:** [components/screens/ProfileScreen.tsx](components/screens/ProfileScreen.tsx)
- **Problem:** The Save button sets `status = "Saved!"` with no API call. No user data is persisted.
- **Fix:** Add a `PATCH /api/profile` route or a `updateProfile` server action that updates `User.name`.

#### B7 — "Add Member" button is a dead placeholder
- **File:** [components/screens/DashboardScreen.tsx](components/screens/DashboardScreen.tsx)
- **Problem:** The "Add Member" quick action button sets a local status string. There is no member creation form, no API route, no Prisma call.
- **Fix:** Build a member creation form (modal or page) with a `POST /api/members` route.

#### B8 — "Export PDF" downloads a `.txt` file
- **File:** [components/screens/AnalyticsScreen.tsx](components/screens/AnalyticsScreen.tsx)
- **Problem:** The export handler creates a `Blob` with the text `"Power Analytics Export — [date]"`, sets the filename to `analytics-report.pdf`, and triggers a download. The file is not a PDF.
- **Fix:** Either use a real PDF library (`jspdf`, `@react-pdf/renderer`) or rename the download to `.txt` and populate it with real data.

---

### 🟡 Security Issues

#### S1 — Demo credentials hardcoded in client bundle
- **File:** [components/screens/LoginScreen.tsx](components/screens/LoginScreen.tsx)
- **Problem:** `LoginScreen` initializes `email` state to `"rob@launchpadphilly.org"` and `password` state to `"password123"`. These are compiled into the client-side JavaScript bundle and visible to anyone who reads the page source or JS files.
- **Fix:** Remove the default values from state initialization. Keep the credentials in the visible demo hint box only (already rendered as plain text), not in state.

#### S2 — Dead `next-auth` dependency + stale secret
- **Files:** [package.json](package.json), [docker-compose.yml](docker-compose.yml)
- **Problem:** `next-auth` is listed as a production dependency but is never imported or used anywhere. Custom session-based auth is used instead. `NEXTAUTH_SECRET` in `docker-compose.yml` exists only for a library that isn't running — it adds confusion and dead surface area.
- **Fix:** Remove `next-auth` from `package.json` dependencies. Remove `NEXTAUTH_SECRET` from `docker-compose.yml`.

#### S3 — No database indexes on foreign key columns
- **File:** [prisma/schema.prisma](prisma/schema.prisma)
- **Problem:** None of the FK columns have `@@index` declarations: `Member.ownerId`, `Workout.memberId`, `Workout.userId`, `WorkoutItem.workoutId`, `Session.userId`. PostgreSQL can still query correctly, but full table scans will occur as data grows.
- **Fix:** Add `@@index` declarations in `schema.prisma` and run a new migration.

#### S4 — Expired sessions are never purged
- **File:** [lib/session.ts](lib/session.ts)
- **Problem:** `Session` rows with `expiresAt` in the past are never deleted. They accumulate in the DB indefinitely. The auth check uses `expiresAt` to reject expired tokens but never cleans up the row.
- **Fix:** Add a `prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } })` call inside `getCurrentUser()` on each request, or a separate periodic cleanup.

---

### 🔵 Dead Code

#### D1 — `Navbar.tsx` is never used
- **File:** [components/Navbar.tsx](components/Navbar.tsx)
- **Problem:** The file exists but is never imported anywhere. `AppShell.tsx` handles all navigation.
- **Fix:** Delete the file.

#### D2 — `react-aria` and `react-stately` are installed but unused
- **File:** [package.json](package.json)
- **Problem:** Both packages are listed as dependencies but no component in the codebase imports from them. HeadlessUI (`@headlessui/react`) is used instead.
- **Fix:** Remove both from `package.json` dependencies.

---

### 🟣 Testing Gaps

#### T1 — No component or integration tests
- **Problem:** Only 2 test files exist: `lib/auth.test.ts` (2 tests) and `lib/workouts.test.ts` (6 tests). No component rendering tests, no API route tests, no end-to-end flow tests.
- **Files missing tests:** `LoginScreen`, `WorkoutsScreen`, `AppShell`, all API routes, `session.ts`, `lib/actions/workouts.ts`
- **Fix:** Add Vitest component tests using `@testing-library/react`. Add API route tests using a test DB or mocked Prisma.

#### T2 — No test for session management
- **File:** [lib/session.ts](lib/session.ts)
- **Problem:** `getCurrentUser()` and `requireUser()` — the most security-critical functions — have zero test coverage.
- **Fix:** Add unit tests for `getCurrentUser` with a mocked cookie reader and Prisma client.

---

### ⚪ Code Quality

#### Q1 — Hardcoded hex colors instead of Tailwind tokens
- **Files:** [components/ui/MotionButton.tsx](components/ui/MotionButton.tsx), [components/AppShell.tsx](components/AppShell.tsx), others
- **Problem:** Colors like `#0f9b78`, `#1f6bc1`, `#edf6ff` are inline style strings or template literals, not Tailwind config values. Changing the color palette requires a grep-and-replace across many files.
- **Fix:** Define custom color tokens in `tailwind.config.ts` and use Tailwind classes throughout.

#### Q2 — No `.env.example` file
- **Problem:** The project requires `DATABASE_URL` (and optionally others) but there is no `.env.example` or `.env.local.example` showing the expected variables. New developers must read through the codebase to discover what's needed.
- **Fix:** Create `.env.example` with all required variable names (blank values).

---

### Summary Table

| ID | Category | Severity | Status | File |
|---|---|---|---|---|
| B1 | Bug | 🔴 Critical | ✅ Fixed | `proxy.ts` — renamed export to `proxy`, upgraded Next.js to v16 |
| B2 | Missing Feature | 🟠 High | Backlog | `WorkoutsScreen.tsx`, `lib/workouts.ts` |
| B3 | Mocked | 🟠 High | Backlog | `AnalyticsScreen.tsx` |
| B4 | Mocked | 🟠 High | ✅ Fixed | `DashboardScreen.tsx` — real DB queries wired in |
| B5 | Mocked | 🟠 Medium | Backlog | `AIScreen.tsx` |
| B6 | Mocked | 🟡 Low | Backlog | `ProfileScreen.tsx` |
| B7 | Missing Feature | 🟠 High | Backlog | `DashboardScreen.tsx` |
| B8 | Bug | 🟡 Low | Backlog | `AnalyticsScreen.tsx` |
| S1 | Security | 🟡 Medium | ✅ Fixed | `LoginScreen.tsx` — removed from state defaults |
| S2 | Dead Dep | 🟡 Low | ✅ Fixed | `docker-compose.yml` — removed NEXTAUTH_SECRET |
| S3 | Performance | 🟡 Medium | ✅ Fixed | `schema.prisma` — indexes added on all FK columns |
| S4 | Security | 🟡 Medium | ✅ Fixed | `session.ts` — expired sessions purged on miss |
| D1 | Dead Code | ⚪ Low | Pending | `Navbar.tsx` — awaiting confirmation to delete |
| D2 | Dead Code | ⚪ Low | Backlog | `package.json` — `react-aria`, `react-stately`, `next-auth` |
| T1 | Testing | 🟣 Medium | Backlog | All screens + routes |
| T2 | Testing | 🟣 Medium | Backlog | `session.ts` |
| Q1 | Quality | ⚪ Low | Backlog | Multiple components |
| Q2 | Quality | 🟡 Medium | ✅ Fixed | `.env.example` created |
