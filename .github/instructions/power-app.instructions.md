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

Do not skip ahead of the current week's deliverables. Build features in this order:

**Week 1:** Problem statement, feature list, wireframe, starter project, Docker setup, Prisma schema draft.

**Week 2:**
- Monday: Refined problem statement, purpose statement, feature list (must-have vs nice-to-have), user journey.
- Tuesday: Login page (rob@launchpadphilly.org / password123), Dashboard, Workout placeholder, Analytics placeholder, AI placeholder, clean folder structure.

When generating code: only implement what the current week's deliverables require. Flag anything that belongs to a future week.

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
