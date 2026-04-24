"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { useRouter } from "next/navigation"
import { useState } from "react"

const kpiCards = [
  { label: "Active Members", value: "47", trend: "Desktop - Primary" },
  { label: "Workout This week", value: "126", trend: "Current period" },
  { label: "Avg. Attendance", value: "82%", trend: "Current period" },
]

export function DashboardScreen() {
  const router = useRouter()
  const [status, setStatus] = useState("Ready")

  return (
    <AppShell
      title="Dashboard"
      subtitle="Daily gym snapshot and coaching workload overview"
      actions={
        <>
          <MotionButton
            onClick={() => {
              setStatus("Navigated to Workouts")
              router.push("/workouts")
            }}
          >
            Add Workout
          </MotionButton>
          <MotionButton variant="ghost" onClick={() => setStatus("Add Member flow opened")}>Add Member</MotionButton>
        </>
      }
    >
      <FadeCard>
        <p className="text-xs sm:text-sm">Action Status: {status}</p>
      </FadeCard>

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
          <ul className="mt-3 space-y-2 text-base leading-tight sm:text-2xl">
            <li>- Mike T: Bench +10 lbs</li>
            <li>- 3 missed sessions this week</li>
            <li>- Reminder: update Deload plans</li>
          </ul>
        </FadeCard>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Context Panel</h2>
          <div className="mt-3 space-y-3 text-base leading-tight sm:text-2xl">
            <div>
              <p>Upcoming Sessions</p>
              <p className="mt-1">- 4:30 PM Sarah L</p>
              <p>5:15 PM - Mike T</p>
            </div>
            <div>
              <p>At-Risk Members</p>
              <p className="mt-1">- 5 low attendance</p>
            </div>
          </div>
        </FadeCard>
      </div>

      <FadeCard className="mt-4">
        <h2 className="text-2xl leading-none sm:text-3xl">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <MotionButton onClick={() => setStatus("Add Member flow opened")}>Add Member</MotionButton>
          <MotionButton variant="ghost" onClick={() => setStatus("History panel refreshed")}>View History</MotionButton>
          <MotionButton
            variant="ghost"
            onClick={() => {
              setStatus("Navigated to Insights")
              router.push("/ai")
            }}
          >
            Open Insights
          </MotionButton>
        </div>
      </FadeCard>
    </AppShell>
  )
}
