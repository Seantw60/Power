Core Project Goal: build a gym-owner app with login, member workout tracking, analytics, AI integration, testing, and Docker support
Bonus Goal: introduce a guided path for AWS EC2 deployment using GitHub Actions without breaking the core pacing

## Business Problem Statement

Independent gym owners often track member workouts across scattered notes, text messages, and spreadsheets, which makes coaching quality inconsistent and progress hard to measure. Without a centralized system, owners lose time on admin work and miss opportunities to retain members through data-driven programming. This matters because member churn directly impacts gym revenue and growth. Power solves this by giving gym owners one place to log workouts, review analytics, and generate AI-assisted coaching insights.

## Wireframe (Text Draft)

```
[Screen 1: Login]
+--------------------------------------------------------------+
| POWER LOGO                                Power Gym Portal   |
|--------------------------------------------------------------|
|                                                              |
|                 +----------------------------------+         |
|                 | Sign In                          |         |
|                 |----------------------------------|         |
|                 | Email                            |         |
|                 | [ rob@launchpadphilly.org     ] |         |
|                 |                                  |         |
|                 | Password                         |         |
|                 | [ ***************              ] |         |
|                 | [ ] Show password                |         |
|                 |                                  |         |
|                 | [ Sign In ]                      |         |
|                 |                                  |         |
|                 | Demo: rob@launchpadphilly.org   |         |
|                 |       password123               |         |
|                 +----------------------------------+         |
|                                                              |
|  Error state: "Invalid credentials" shown inline under form |
+--------------------------------------------------------------+

                               |
                               v

[Screen 2: Dashboard]
+--------------------------------------------------------------------------------+
| LOGO | Dashboard | Workouts | Analytics | AI Insights | Profile | Logout      |
|--------------------------------------------------------------------------------|
| Dashboard                                              [ Add Workout ]          |
|--------------------------------------------------------------------------------|
| +-------------------+ +-------------------+ +-------------------+              |
| | Active Members    | | Workouts This Week| | Avg Attendance    |              |
| | 47                | | 126               | | 82%               |              |
| +-------------------+ +-------------------+ +-------------------+              |
|                                                                                |
| +-----------------------------------------------+   +------------------------+ |
| | Activity Feed                                 |   | Context Panel          | |
| | - Mike T: Bench +10 lbs                       |   | Upcoming Sessions      | |
| | - 3 missed sessions this week                 |   | - 4:30 PM Sarah L      | |
| | - Reminder: update Deload plans               |   | At-Risk Members        | |
| +-----------------------------------------------+   | - 5 low attendance     | |
|                                                     +------------------------+ |
|                                                                                |
| Quick Actions: [Add Workout] [Add Member] [History] [Open AI Insights]        |
+--------------------------------------------------------------------------------+

           +--------------------------+--------------------------+
           |                          |                          |
           v                          v                          v

[Screen 3: Workouts]
+--------------------------------------------------------------------------------+
| LOGO | Dashboard | Workouts | Analytics | AI Insights | Profile | Logout      |
|--------------------------------------------------------------------------------|
| Workouts                                     [ Add Workout ] [ Export CSV ]    |
|--------------------------------------------------------------------------------|
| Filters: Member [All v]  Date [2026-04-15]  Type [Strength v]  Coach [Rob v]  |
| Search: [ Mike / Squat / Notes...                          ] [ Apply ] [ Reset ]|
|--------------------------------------------------------------------------------|
| +-----------------------------------------------+   +------------------------+ |
| | Log Workout                                   |   | Session Snapshot       | |
| | Exercise: [Back Squat                      ]  |   | Completed Today: 12    | |
| | Sets: [4]  Reps: [8]  Weight: [185]  RPE:[7] |   | Missed This Week: 3    | |
| | Duration: [45 min]  Rest: [120 sec]          |   | Avg Intensity: RPE 7.2 | |
| | Notes: [Felt strong through final two sets ]  |   | PR Alerts: 2 pending   | |
| | [ Save Workout ] [ Save + Add Another ]       |   +------------------------+ |
| +-----------------------------------------------+                            |
|                                                                                |
| History (Newest First)                                                      |
| 04/15  Mike T  Back Squat  4x8 @185  RPE7   Notes: smooth tempo              |
| 04/13  Sarah L Bench Press 5x5 @155  RPE8   Notes: shoulder stable           |
| 04/12  Adam K  Deadlift    3x5 @245  RPE8   Notes: reduce volume next block  |
| Actions: [View] [Edit] [Delete] [Duplicate]                                   |
+--------------------------------------------------------------------------------+

[Screen 4: Analytics]
+--------------------------------------------------------------------------------+
| LOGO | Dashboard | Workouts | Analytics | AI Insights | Profile | Logout      |
|--------------------------------------------------------------------------------|
| Analytics                                   [ Compare Periods ] [ Export PDF ] |
|--------------------------------------------------------------------------------|
| Filters: Range [30d v]  Member [All v]  Metric [Volume v]  Segment [All v]    |
| Trend Type: [ Weekly v ]  Goal Focus: [ Strength v ]  [ Apply ] [ Reset ]     |
|--------------------------------------------------------------------------------|
| +-----------------------------------------------+   +------------------------+ |
| | Volume Trend                                  |   | Insights Summary       | |
| | Jan: 8.4k  Feb: 9.1k  Mar: 9.8k  Apr: 10.2k   |   | Top Improver: Sarah L  | |
| | (Line chart rising with slight dip week 2)    |   | At-Risk: 5 members     | |
| +-----------------------------------------------+   | Adherence: 82% avg      | |
| +-----------------------------------------------+   | Recovery Flags: 3       | |
| | Session Frequency by Member                   |   +------------------------+ |
| | Mike T: 4/wk  Sarah L: 3/wk  Adam K: 2/wk     |                            |
| | (Bar chart with goal marker at 3 sessions)    |                            |
| +-----------------------------------------------+                            |
|                                                                                |
| Coaching Recommendations:                                                      |
| - Increase lower-body volume 10% for members above 90% adherence              |
| - Trigger outreach when attendance drops below 2 sessions for 2 weeks          |
| - Schedule deload guidance for high-fatigue group next microcycle              |
+--------------------------------------------------------------------------------+

[Screen 5: AI Insights]
+--------------------------------------------------------------------------------+
| LOGO | Dashboard | Workouts | Analytics | AI Insights | Profile | Logout      |
|--------------------------------------------------------------------------------|
| AI Insights                              [ New Prompt ] [ Save to Member Plan ] |
|--------------------------------------------------------------------------------|
| Prompt Builder: Member [Sarah L v]  Goal [Strength v]  Time Horizon [2 weeks] |
| Context Toggles: [x] Attendance  [x] Volume  [x] Recovery Notes  [ ] Nutrition |
| Question: [ Deload next week while preserving bench progress?                ] |
| [ Generate Insight ] [ Regenerate ] [ Copy ] [ Attach to Check-In ]            |
|--------------------------------------------------------------------------------|
| +-----------------------------------------------+   +------------------------+ |
| | AI Response                                   |   | Safety + Review        | |
| | Suggested Plan:                               |   | Coach review required  | |
| | 1) Reduce total volume by 15% for 5 days      |   | before member delivery | |
| | 2) Keep intensity near RPE 7 on compounds     |   | Confidence: Medium     | |
| | 3) Add one extra rest day after heavy bench   |   | Last Updated: 3:42 PM  | |
| | 4) Re-evaluate bar speed after deload block   |   +------------------------+ |
| +-----------------------------------------------+                            |
|                                                                                |
| Prompt / Response History                                                       |
| - 04/20 3:42 PM  Sarah L  "Deload timing"      Status: Reviewed               |
| - 04/18 1:12 PM  Mike T   "Plateau on squat"   Status: Needs follow-up        |
| - 04/16 9:04 AM  Adam K   "Recovery dip"       Status: Applied                |
+--------------------------------------------------------------------------------+

[Shared Interaction Notes]
- Login success -> Dashboard
- Dashboard quick action "Add Workout" -> Workouts with form focused
- Workouts save -> success toast + history refresh
- Analytics with no data -> empty card "Log workouts to see trends"
- AI request loading -> skeleton response panel + retry on error

[Mobile Layout Snapshot]
+--------------------------------------+
| [=] Power              [Profile]     |
|--------------------------------------|
| Page Title                             |
| KPI Card 1                             |
| KPI Card 2                             |
| KPI Card 3                             |
| Activity Feed                          |
| [Primary Action Button]                |
|--------------------------------------|
| Nav: Dashboard | Workouts | Analytics |
+--------------------------------------+
```

Week 1: Deliverables
- business problem statement
- feature list
- Wireframe
- starter project running locally
- starter Docker setup
- draft Prisma schema plan

Week 2: Deliverables
Monday
- gym-owner problem statement refined 
  - 3–5 sentences
  - identifies the main user
  - explains the real business problem
  - explains why the problem matters

- app purpose statement added to problem statement
  - 1–2 sentences
  - explains how the app will solve the problem for the gym owner

- required feature list in GitHub repo 
  - login
  - member workout tracking
  - analytics
  - AI feature

- must-have vs nice-to-have feature list
- user journey draft
  - basic flow from login to dashboard to workout tracking to analytics to AI


Tuesday
- Login page -> rob@launchpadphilly.org password123
- Dashboard page
- Workout placeholder
- Analytics placeholder
- AI placeholder
- clean folder structure
- peer review notes

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
