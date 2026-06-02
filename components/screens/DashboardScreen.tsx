"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { useRouter } from "next/navigation"

type DashboardScreenProps = {
  memberCount: number
  weeklyWorkouts: number
  recentWorkouts: { id: string; memberName: string; date: string }[]
}

export function DashboardScreen({ memberCount, weeklyWorkouts, recentWorkouts }: DashboardScreenProps) {
  const router = useRouter()

  const kpiCards = [
    { label: "Active Members", value: String(memberCount), trend: "Total registered" },
    { label: "Workouts This Week", value: String(weeklyWorkouts), trend: "Current week" },
    { label: "Avg. Attendance", value: "—", trend: "Coming soon" },
  ]

  return (
    <AppShell
      title="Dashboard"
      subtitle="Daily gym snapshot and coaching workload overview"
      actions={
        <>
          <MotionButton
            onClick={() => {
              router.push("/workouts")
            }}
          >
            Add Workout
          </MotionButton>
          <MotionButton variant="ghost" onClick={() => router.push("/members")}>Add Member</MotionButton>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {kpiCards.map((card) => (
          <FadeCard key={card.label}>
            <p className="text-lg leading-tight sm:text-xl">{card.label}</p>
            <p className="mt-2 text-4xl leading-none tracking-tight sm:text-5xl">{card.value}</p>
            <p className="mt-2 text-xs text-[#4a4a4a]">{card.trend}</p>
          </FadeCard>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Activity Feed</h2>
          {recentWorkouts.length === 0 ? (
            <p className="mt-3 text-sm text-[#4a7aab]">No workouts logged yet. Log a session to see recent activity here.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-base leading-tight sm:text-2xl">
              {recentWorkouts.map((item) => (
                <li key={item.id}>
                  — {item.memberName}: session on {item.date}
                </li>
              ))}
            </ul>
          )}
        </FadeCard>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Quick Actions</h2>
          <div className="mt-3 flex flex-col gap-2">
            <MotionButton onClick={() => router.push("/workouts")}>Log Workout</MotionButton>
            <MotionButton variant="secondary" onClick={() => router.push("/workouts")}>View History</MotionButton>
            <MotionButton variant="ghost" onClick={() => router.push("/ai")}>AI Insights</MotionButton>
          </div>
        </FadeCard>
      </div>
    </AppShell>
  )
}
