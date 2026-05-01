# Power — Gym Owner App

**Core Goal:** Build a gym-owner app with login, member workout tracking, analytics, AI integration, testing, and Docker support.

**Bonus Goal:** Introduce a guided path for AWS EC2 deployment using GitHub Actions without breaking the core pacing.

## Business Problem Statement

Independent gym owners often track member workouts across scattered notes, text messages, and spreadsheets, which makes coaching quality inconsistent and progress hard to measure. Without a centralized system, owners lose time on admin work and miss opportunities to retain members through data-driven programming. This matters because member churn directly impacts gym revenue and growth. Power solves this by giving gym owners one place to log workouts, review analytics, and generate AI-assisted coaching insights.

## App Purpose Statement

Power is a web app built for independent gym owners to centralize member workout tracking, analytics, and AI coaching — replacing scattered spreadsheets and notes with one fast, focused tool that helps owners coach better and retain more members.

## Feature List

### Must-Have
- **Authentication** — Secure login for gym owners (email + password)
- **Member management** — Add and view gym members
- **Workout tracking** — Log exercises, sets, reps, weight, and duration per member
- **Analytics dashboard** — View workout trends, member activity, and progress over time
- **AI coaching insights** — Generate AI-assisted recommendations based on member workout data

### Nice-to-Have
- Member-facing login (members view their own progress)
- Workout plan templates (reusable programs assigned to members)
- Export data to CSV / PDF
- Push or email notifications for member check-ins
- Mobile app (React Native or PWA)
- AWS EC2 deployment via GitHub Actions CI/CD

## User Journey

1. **Login** — Gym owner visits the app and logs in with email and password
2. **Dashboard** — Lands on the dashboard showing member activity summary and quick-action buttons
3. **Add Workout** — Taps "Add Workout" to open the Workouts page with the log form focused; fills in member, exercise, sets, reps, and weight; saves to database
4. **Review Workouts** — Scrolls workout history for a specific member to review recent sessions
5. **Analytics** — Navigates to Analytics to view trends — total workouts, top exercises, member progress over time
6. **AI Insights** — Navigates to AI Insights, submits a prompt (e.g. "What should I program for Sarah next week?"), and receives AI-generated coaching recommendations based on her workout history
7. **Profile / Logout** — Views profile or logs out from the nav

## Wireframe

### Screens

**Screen 1: Login**
![Login Screen Wireframe](./public/Login.png)

**Screen 2: Dashboard**
![Dashboard Wireframe](./public/Dashboard.png)

**Screen 3: Workouts**
![Workouts Screen Wireframe](./public/Workouts.png)

**Screen 4: Analytics**
![Analytics Screen Wireframe](./public/Analytics.png)

**Screen 5: AI Insights**
![AI Insights Wireframe](./public/Insights.png)

### Interaction Notes

- Login success → Dashboard
- Dashboard quick action "Add Workout" → Workouts with form focused
- Workouts save → success toast + history refresh
- Analytics with no data → empty card: "Log workouts to see trends"
- AI request loading → skeleton response panel + retry on error

### Mobile Layout

```
+--------------------------------------+
| [=] Power              [Profile]     |
|--------------------------------------|
| Page Title                           |
| KPI Card 1                           |
| KPI Card 2                           |
| KPI Card 3                           |
| Activity Feed                        |
| [Primary Action Button]              |
|--------------------------------------|
| Nav: Dashboard | Workouts | Analytics |
+--------------------------------------+
```

---

## Deliverables

### Week 1

- Business problem statement
- Feature list
- Wireframe
- Starter project running locally
- Starter Docker setup
- Draft Prisma schema plan

### Week 2

#### Monday

- Gym-owner problem statement refined
  - 3–5 sentences
  - Identifies the main user
  - Explains the real business problem
  - Explains why the problem matters
- App purpose statement
  - 1–2 sentences
  - Explains how the app will solve the problem for the gym owner
- Required feature list in GitHub repo
  - Login
  - Member workout tracking
  - Analytics
  - AI feature
- Must-have vs. nice-to-have feature list
- User journey draft — basic flow from login → dashboard → workout tracking → analytics → AI

By the end of Monday, associates should submit or show:

- **Refined problem statement** — 3–5 sentences identifying the user, the business problem, and why it matters
- **App purpose statement** — 1–2 sentences explaining how the app solves the problem
- **Feature list in GitHub repo** — login, member workout tracking, analytics, AI feature
- **Must-have vs. nice-to-have** feature list
- **User journey draft** — basic flow from login → dashboard → workout tracking → analytics → AI

#### Tuesday

- Login page (rob@launchpadphilly.org / password123)
- Dashboard page
- Workouts placeholder
- Analytics placeholder
- AI placeholder
- Clean folder structure
- Peer review notes

By the end of Tuesday, associates should submit or show:

- **Starter page structure**
  - Starter login page
  - Starter dashboard page
  - Placeholder for workout page
  - Placeholder for analytics page
  - Placeholder for AI section or page
- **Clean project folder structure**
  - `/app`
  - `/components`
  - `/scripts`
  - Any other clearly named starter folders
- **Revised project structure notes** — short explanation of what each main folder is for
- **CI verification** — CI still checks required scripts and structure; associates can explain what CI is checking
- **Peer review notes**
  - One strong structure decision
  - One missing file or page

> **Demo login:** rob@launchpadphilly.org / password123

### Week 3

#### Monday

- Prisma installed and initialized
- `schema.prisma` exists
- `DATABASE_URL` environment variable added
- `User` model
- `Member` model
- `Workout` model
- `WorkoutItem` model
- Relationship notes — 2–4 sentence paragraph on the relationships between tables
- Migration workflow notes — 2–4 sentence paragraph on the Prisma migration workflow
- Peer review notes — meaningful feedback added to a teammate's project

By the end of Monday, associates should submit or show:

- **Prisma setup completed**
  - Prisma installed
  - Prisma initialized in the project
  - `prisma/schema.prisma` file present
- **Database connection configured**
  - Environment variable added for the database connection
  - Associates can explain what the connection string is for
- **Draft schema with core models**
  - `User`
  - `Member`
  - `Workout`
  - `WorkoutItem`

#### Expected Schema

| Model | Fields |
|---|---|
| `User` | id, name, email, password |
| `Member` | id, name, age, goal, ownerId |
| `Workout` | id, date, notes, memberId |
| `WorkoutItem` | id, exerciseName, sets, reps, weight, workoutId |

#### Relationship Notes

- One user has many members
- One member has many workouts
- One workout has many workout items

#### Migration Workflow Notes

- A migration captures a schema change as a versioned SQL file that can be applied to any database consistently
- Tracking schema changes ensures the database stays in sync across local, staging, and production environments

#### Peer Review Notes

- One strong model choice
- One missing field
- One relationship to check again

> **Peer review example:** "I noticed your README did not have the correct steps to set up the project. I had to run `pnpm dev` instead of `npm dev`."

#### Relationship Notes

Each gym owner (User) can have many Members. Each Member can have many Workouts, representing individual training sessions. Each Workout can have many WorkoutItems, where each item captures a single exercise with its sets, reps, and weight. This structure keeps session-level data separate from exercise-level data, making it easier to query and display workout history per member.

#### Migration Workflow Notes (Written)

A migration is a versioned record of a schema change — when you run `prisma migrate dev`, Prisma compares your current `schema.prisma` to the database and generates SQL to bring them in sync. Tracking migrations matters because it ensures every environment (local, staging, production) applies the same changes in the same order, preventing schema drift and data loss.

#### Tuesday

- First migration completed
- DB connection confirmed
- Starter login page with email field, password field, and login button
- Basic auth flow
- Protected dashboard
- Auth flow explanation
- CI verification
- Peer review notes

By the end of Tuesday, associates should submit or show:

- **First migration completed**
  - Migration command run successfully
  - Database tables created
  - Associates can explain what changed
- **Database connection confirmed**
  - App can connect to the database
  - No missing environment variable blockers
- **Starter login page**
  - Email field
  - Password field
  - Login button
- **Basic authentication flow**
  - Associates can describe what happens on submit
  - Success path and failure path are both considered
- **Protected dashboard**
  - Unauthorized users cannot access the dashboard normally
  - Redirect or blocked state exists
- **Auth flow explanation** — short written explanation of:
  - What happens when login succeeds
  - What happens when login fails
  - Why the dashboard needs protection
- **CI verification**
  - Schema file still exists
  - Scripts still exist
  - App still installs
  - Auth-related starter files are present
- **Peer review notes**
  - One working auth step
  - One confusing auth step
  - One improvement to redirect or error handling

#### Auth Flow Explanation (Written)

When a user submits the login form, the client sends a `POST` request to `/api/auth/login` with email and password. The backend looks up the user in PostgreSQL through Prisma and verifies the password hash with bcrypt. If credentials are valid, the server creates a record in the `Session` table, sets an HttpOnly `power_session` cookie, and redirects the user to the dashboard (or requested protected page). If credentials are invalid, the API returns a `401` response and the login page shows an error without redirecting. Protected routes require a valid, unexpired session tied to the cookie, so direct access without authentication redirects back to `/login`.

### Week 4

#### Monday

- Workout entry form
- Required fields added
- Submit handler
- Backend create route
- Prisma save logic
- Validation
- Success or error state
- Peer review notes

By the end of Monday, associates should submit or show:

- **Workout entry form**
  - Form exists in the app
  - Fields are clearly labeled
  - Form is placed in a logical page or dashboard flow
- **Required workout fields** — at minimum:
  - Member name or member selector
  - Workout date
  - Notes
  - Exercise name
  - Sets
  - Reps
  - Weight
- **Submit handler**
  - Form has a clear submit action
  - Associates can explain what happens after the user clicks submit
- **Backend create route**
  - Route exists for saving workout data
  - Associates can explain what the route is responsible for
- **Prisma save logic**
  - Workout data is sent to Prisma correctly
  - At least one record can be saved to the database
- **Validation**
  - Required fields are checked
  - Bad or missing input is handled visibly
- **Success or failure message** — user sees a clear success state or error state after submit
- **Peer review notes**
  - One strong part of the form
  - One validation issue
  - One part of the save flow that is unclear

#### Tuesday

- Workout history page or section
- Saved workouts displayed from DB
- Readable layout
- Empty state
- Read/query explanation
- Form-to-display explanation
- CI verification
- Peer review notes

By the end of Tuesday, associates should submit or show:

- **Workout history page or section**
  - Saved workouts are visible in the app
  - Workout records are pulled from the database, not hard-coded
- **Readable workout display**
  - Records include enough information to make sense to the gym owner
  - Layout is organized clearly
- **Empty state** — if no workout records exist, the app shows a clear empty state
- **Read/query logic**
  - Associates can explain how workout data is being retrieved
  - Associates can explain where the data is coming from
- **Form-to-display connection** — at least one created workout can be saved and later seen in the UI
- **Flow explanation** — short written explanation of:
  - What happens when a workout is submitted
  - Where the data is stored
  - How it gets displayed again
- **CI verification**
  - Route files still exist
  - App still installs
  - Scripts still run
  - Project structure still supports the feature flow
- **Peer review notes**
  - One part of the read flow that works well
  - One display issue
  - One question about how the data gets from DB to UI

#### Flow Explanation

When a gym owner submits the workout form, the `createWorkout` Server Action is called with the raw form data. The action validates all required fields — member, exercise name, sets, and reps — and returns inline field errors if anything is missing or invalid. If validation passes, the action calls `getCurrentUser()` to read the authenticated session from the database, confirms the selected member belongs to that gym owner, then calls `prisma.workout.create()` to persist the workout and its exercise items in a single nested write. After saving, `revalidatePath("/workouts")` tells Next.js to re-fetch the page's server data so the new workout immediately appears in the history list below the form — no page reload required. The data flows from the form → Server Action → Prisma → PostgreSQL and back up to the screen automatically through Next.js's server component re-render.

If the user is not authenticated when the action runs, it returns an error state and the form displays "Session user not found. Please log in again." No workout is saved.
---

## Week 1 Setup

### Tech Stack
- **Next.js 14+** with TypeScript and React 18
- **Prisma 7** with PostgreSQL
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Docker** for containerization

### Local Development

#### Prerequisites
- Node.js 20+ (or use Docker)
- PostgreSQL 16+ (or use Docker Compose)

#### Option 1: Local Setup (without Docker)
```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Update DATABASE_URL if using local PostgreSQL

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Run migrations (requires PostgreSQL running)
npm run prisma:migrate

# 5. Start dev server
npm run dev
```

#### Option 2: Docker Compose (Recommended)
```bash
# Start app + PostgreSQL
docker compose up

# On first run, run migrations in a separate terminal:
docker compose exec app npm run prisma:migrate
```

The app will be available at **http://localhost:3000**

#### Demo Login
- Email: `rob@launchpadphilly.org`
- Password: `password123`

### Project Structure
```
app/              # Next.js App Router pages
├── (auth)/       # Authentication routes
├── dashboard/    # Dashboard page
├── workouts/     # Workouts page
├── analytics/    # Analytics page
└── ai/           # AI feature page

components/       # Reusable React components
lib/              # Utilities, Prisma client, helpers
prisma/           # Prisma schema & migrations
```

### Database Schema (Draft)
- **User**: Gym owners and members
- **Member**: Members under a gym owner
- **Workout**: Workout records per member
- **Session**: User sessions for authentication

See `prisma/schema.prisma` for full schema.
