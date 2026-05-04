---
description: "Use when building, editing, or reviewing any part of the Power gym-owner app. Covers tech stack conventions, folder structure, code style, week-by-week pacing, testing, Docker, and AWS/CI-CD guardrails."
applyTo: "**/*.{ts,tsx}"
---

# Power Gym App — Project Instructions

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with React 18+
- **Language**: TypeScript — always. No plain `.js` files unless config requires it.
- **Styling**: TailwindCSS utility classes only. No inline styles, no CSS modules unless unavoidable.
- **Accessible components**: HeadlessUI and React Aria. Prefer these over building raw interactive elements.
- **Animations**: Framer Motion for transitions and motion. Keep animations subtle and purposeful — this is a business tool, not a portfolio site.
- **ORM**: Prisma 7 with PostgreSQL database. Always define models in `prisma/schema.prisma` before writing queries.
- **Runtime**: Docker for local dev and production parity. Every feature should run in Docker.

## Folder Structure

Follow this structure. Do not invent new top-level folders without a clear reason.

```
/
├── .github/
│   ├── instructions/
│   └── workflows/          # GitHub Actions CI/CD
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login/auth routes
│   ├── dashboard/
│   ├── workouts/
│   ├── analytics/
│   └── ai/
├── components/             # Reusable UI components
├── lib/                    # Shared utilities, helpers, Prisma client
├── prisma/                 # schema.prisma + migrations
├── public/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Code Style

- Use named exports for components, not default exports (except page files which Next.js requires as default).
- Component filenames: `PascalCase.tsx`. Utility files: `camelCase.ts`.
- Keep components small and focused. Extract reusable UI into `components/`.
- Use `async/await` over `.then()` chains.
- Server Components by default in App Router. Add `"use client"` only when interactivity or browser APIs are needed.
- Prisma queries belong in `lib/` or Server Actions — never in Client Components.

## Deliverable Pacing

Do not skip ahead of the current week's deliverables. Build features in this order. When generating code: only implement what the current week's deliverables require. Flag anything that belongs to a future week. Always refer to this section before writing or reviewing any feature code.

---

### Week 1

- Business problem statement
- Feature list
- Wireframe
- Starter project running locally
- Starter Docker setup
- Draft Prisma schema plan

---

### Week 2

#### Monday

Deliverables:
- Gym-owner problem statement refined (3–5 sentences, identifies user, explains business problem and why it matters)
- App purpose statement (1–2 sentences explaining how the app solves the problem)
- Required feature list in GitHub repo: login, member workout tracking, analytics, AI feature
- Must-have vs. nice-to-have feature list
- User journey draft — login → dashboard → workout tracking → analytics → AI

By the end of Monday, associates should submit or show:
- **Refined problem statement** — 3–5 sentences identifying the user, the business problem, and why it matters
- **App purpose statement** — 1–2 sentences explaining how the app solves the problem
- **Feature list in GitHub repo** — login, member workout tracking, analytics, AI feature
- **Must-have vs. nice-to-have** feature list
- **User journey draft** — basic flow from login → dashboard → workout tracking → analytics → AI

#### Tuesday

Deliverables:
- Login page (`rob@launchpadphilly.org` / `password123`)
- Dashboard page
- Workouts placeholder
- Analytics placeholder
- AI placeholder
- Clean folder structure
- Peer review notes

By the end of Tuesday, associates should submit or show:
- **Starter page structure** — login, dashboard, workouts, analytics, AI pages present
- **Clean project folder structure** — `/app`, `/components`, and any other clearly named starter folders
- **Revised project structure notes** — short explanation of what each main folder is for
- **CI verification** — CI still checks required scripts and structure
- **Peer review notes** — one strong structure decision, one missing file or page

---

### Week 3

#### Monday

Deliverables:
- Prisma installed and initialized
- `schema.prisma` exists
- `DATABASE_URL` environment variable added
- `User`, `Member`, `Workout`, `WorkoutItem` models defined
- Relationship notes (2–4 sentences)
- Migration workflow notes (2–4 sentences)
- Peer review notes

Expected schema:

| Model | Fields |
|---|---|
| `User` | id, name, email, password |
| `Member` | id, name, age, goal, ownerId |
| `Workout` | id, date, notes, memberId |
| `WorkoutItem` | id, exerciseName, sets, reps, weight, workoutId |

By the end of Monday, associates should submit or show:
- **Prisma setup completed** — installed, initialized, `prisma/schema.prisma` present
- **Database connection configured** — `DATABASE_URL` set; associate can explain the connection string
- **Draft schema with core models** — `User`, `Member`, `Workout`, `WorkoutItem`
- **Peer review notes** — one strong model choice, one missing field, one relationship to check

#### Tuesday

Deliverables:
- First migration completed
- DB connection confirmed
- Starter login page (email field, password field, login button)
- Basic auth flow
- Protected dashboard
- Auth flow explanation
- CI verification
- Peer review notes

By the end of Tuesday, associates should submit or show:
- **First migration completed** — migration command run, tables created, associate can explain what changed
- **Database connection confirmed** — app connects to DB, no missing env variable blockers
- **Starter login page** — email field, password field, login button
- **Basic authentication flow** — associate can describe success and failure paths on submit
- **Protected dashboard** — unauthorized users cannot access the dashboard; redirect or blocked state exists
- **Auth flow explanation** — short written explanation: what happens on login success, on login failure, and why the dashboard needs protection
- **CI verification** — schema file, scripts, app install, and auth-related starter files all present
- **Peer review notes** — one working auth step, one confusing auth step, one improvement to redirect or error handling

Auth flow: POST to `/api/auth/login` → Prisma user lookup → bcrypt verify → Session row + HttpOnly `power_session` cookie → redirect to dashboard. On failure: 401, no redirect, error shown. Protected routes check the cookie and redirect to `/login` if missing or expired.

---

### Week 4

#### Monday

Deliverables:
- Workout entry form with required fields (member, date, notes, exercise name, sets, reps, weight)
- Submit handler
- Backend create route
- Prisma save logic
- Validation with visible inline errors
- Success or error state after submit
- Peer review notes

By the end of Monday, associates should submit or show:
- **Workout entry form** — form exists, fields are labeled, form is in a logical page or dashboard flow
- **Required workout fields** — member selector, date, notes, exercise name, sets, reps, weight
- **Submit handler** — clear submit action; associate can explain what happens after clicking submit
- **Backend create route** — route exists for saving workout data; associate can explain its responsibility
- **Prisma save logic** — workout data sent to Prisma correctly; at least one record can be saved
- **Validation** — required fields checked, bad input handled visibly
- **Success or failure message** — user sees clear success or error state after submit
- **Peer review notes** — one strong part of the form, one validation issue, one unclear part of the save flow

#### Tuesday

Deliverables:
- Workout history page or section showing saved workouts from DB
- Readable layout
- Empty state when no records exist
- Read/query explanation
- Form-to-display explanation
- CI verification
- Peer review notes

By the end of Tuesday, associates should submit or show:
- **Workout history page or section** — saved workouts visible, pulled from DB not hard-coded
- **Readable workout display** — records include enough information; layout is clearly organized
- **Empty state** — if no workout records exist, a clear empty state is shown
- **Read/query logic** — associate can explain how data is retrieved and where it comes from
- **Form-to-display connection** — at least one created workout can be saved and later seen in the UI
- **Flow explanation** — short written explanation: what happens when a workout is submitted, where data is stored, how it gets displayed again
- **CI verification** — route files, app install, scripts, and project structure all still valid
- **Peer review notes** — one part of the read flow that works well, one display issue, one question about DB-to-UI data flow

Flow: `createWorkout` Server Action → validate → `getCurrentUser()` → ownership check → `prisma.workout.create()` nested write → `revalidatePath("/workouts")` → history re-renders from fresh server data. Unauthenticated action returns an error state; no workout is saved.

---

### Week 5

#### Monday

Deliverables:
- Edit workflow — at least one workout field can be edited; correct record selected by id + ownership; updated data reflected after save
- Delete workflow — at least one workout record can be deleted; removed workout no longer appears in list
- Full CRUD cycle demonstrated (create, read, update, delete)
- UI updates correctly after each change — no stale data remains visible
- Error or fallback handling — visible message or handling path exists for edit and delete failures
- Short CRUD explanation (2–4 sentences on what CRUD means in this app and why gym owners need the full workflow)
- Peer review notes

By the end of Monday, associates should submit or show:
- **Edit workflow** — at least one field editable, associate can explain how the correct record is selected, updated data reflected after save
- **Delete workflow** — record can be deleted, associate can explain what happens after delete, removed workout no longer visible
- **Full CRUD cycle demonstrated** — create, read, update, delete all working
- **UI update after change** — history reflects edit and delete changes; no stale data visible
- **Error or fallback handling** — associate has considered what happens if edit or delete fails; at minimum one visible message or handling path exists
- **Short CRUD explanation** — 2–4 sentences on what CRUD means in this app and why gym owners need the full workflow
- **Peer review notes** — one part of CRUD that works well, one bug or confusion point, one improvement to the edit/delete flow

Implementation notes:
- Correct record selection: `prisma.workout.findFirst({ where: { id, userId } })` before any mutation — never mutate without ownership verification.
- UI freshness: use `revalidatePath("/workouts")` after update and delete, consistent with the create pattern.
- Edit form: `workoutId` passes as a hidden input; `updateWorkout` server action validates via `validateWorkoutUpdateInput`.
- Delete form: two-step confirm pattern with a guarded hidden `workoutId` input; `deleteWorkout` server action validates via `validateWorkoutDeleteInput`.
- Fallback errors: both actions have `try/catch` that returns a visible `"Could not update/delete workout. Please try again."` message.
- API parity: `PATCH /api/workouts` and `DELETE /api/workouts` use the same shared `updateWorkoutForUser` and `deleteWorkoutForUser` helpers from `lib/workouts.ts`.

## Authentication

- Use the credentials: `rob@launchpadphilly.org` / `password123` for local dev/demo login.
- Do not hardcode credentials in source code. Use environment variables (`.env.local`).
- Implement auth with NextAuth.js or a similar session-based approach.

## Testing

- Write tests alongside features, not after.
- Use Vitest or Jest for unit tests. Place test files adjacent to the code they test: `Component.test.tsx`.
- Integration/E2E tests go in `__tests__/` or a `tests/` folder at root.
- Never ship a feature without at least one test covering the happy path.

## Docker

- `docker-compose.yml` should define the app + PostgreSQL services.
- The app must be fully runnable with `docker compose up` — no manual steps required.
- Use multi-stage builds in `Dockerfile` to keep images lean.
- Never put secrets in `Dockerfile` or `docker-compose.yml`. Use `.env` files and `.dockerignore`.

## AWS / CI-CD Guardrails

- GitHub Actions workflows live in `.github/workflows/`.
- Do not add deployment steps until the Week 1 Docker baseline is verified locally.
- Deployment target: AWS EC2. Introduce this progressively — local Docker first, EC2 second.
- Never commit AWS credentials, `.pem` files, or secrets to the repo. Use GitHub Secrets.
