"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

type MonthBucket = { label: string; count: number }
type MemberFrequency = { name: string; count: number }

type AnalyticsScreenProps = {
  monthlyWorkouts: MonthBucket[]
  memberFrequency: MemberFrequency[]
  totalWorkouts: number
  topMember: MemberFrequency | null
}

export function AnalyticsScreen({ monthlyWorkouts, memberFrequency, totalWorkouts, topMember }: AnalyticsScreenProps) {
  const [status, setStatus] = useState("Ready")

  const maxMonthly = Math.max(...monthlyWorkouts.map((m) => m.count), 1)
  const maxMember = Math.max(...memberFrequency.map((m) => m.count), 1)

  const reportText = useMemo(
    () =>
      [
        "Power Analytics Report",
        `Generated: ${new Date().toLocaleDateString()}`,
        `Total workouts (last 4 months): ${totalWorkouts}`,
        `Top member: ${topMember ? `${topMember.name} (${topMember.count} sessions)` : "N/A"}`,
        "",
        "Monthly breakdown:",
        ...monthlyWorkouts.map((m) => `  ${m.label}: ${m.count} sessions`),
        "",
        "Member frequency:",
        ...memberFrequency.map((m) => `  ${m.name}: ${m.count} sessions`),
      ].join("\n"),
    [monthlyWorkouts, memberFrequency, totalWorkouts, topMember],
  )

  const exportReport = () => {
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "analytics-report.txt")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setStatus("Analytics report exported")
  }

  return (
    <AppShell
      title="Analytics"
      subtitle="Measure attendance, volume, and consistency trends"
      actions={
        <>
          <MotionButton variant="secondary" onClick={exportReport}>
            Export Report
          </MotionButton>
        </>
      }
    >
      <FadeCard>
        <p className="text-xs sm:text-sm">Action Status: {status}</p>
      </FadeCard>

      <div className="grid gap-4 md:grid-cols-3">
        <FadeCard>
          <p className="text-lg leading-tight sm:text-xl">Total Sessions</p>
          <p className="mt-2 text-4xl leading-none tracking-tight sm:text-5xl">{totalWorkouts}</p>
          <p className="mt-2 text-xs text-[#4a4a4a]">Last 4 months</p>
        </FadeCard>
        <FadeCard>
          <p className="text-lg leading-tight sm:text-xl">Active Members</p>
          <p className="mt-2 text-4xl leading-none tracking-tight sm:text-5xl">
            {memberFrequency.filter((m) => m.count > 0).length}
          </p>
          <p className="mt-2 text-xs text-[#4a4a4a]">With sessions logged</p>
        </FadeCard>
        <FadeCard>
          <p className="text-lg leading-tight sm:text-xl">Top Member</p>
          <p className="mt-2 text-4xl leading-none tracking-tight sm:text-5xl">
            {topMember ? topMember.count : "—"}
          </p>
          <p className="mt-2 text-xs text-[#4a4a4a]">{topMember ? `${topMember.name} — sessions` : "No sessions yet"}</p>
        </FadeCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <FadeCard>
            <h2 className="text-2xl leading-none sm:text-3xl">Monthly Sessions</h2>
            {totalWorkouts === 0 ? (
              <p className="mt-3 text-sm text-[#4a7aab]">No workouts logged yet. Start tracking to see trends here.</p>
            ) : (
              <>
                <p className="mt-1 text-sm sm:text-base">
                  {monthlyWorkouts.map((m) => `${m.label}: ${m.count}`).join("  ")}
                </p>
                <div className="mt-4 flex items-end gap-3" style={{ height: 120 }}>
                  {monthlyWorkouts.map((bucket, index) => (
                    <div key={bucket.label} className="flex flex-1 flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.round((bucket.count / maxMonthly) * 100)}%` }}
                        transition={{ delay: index * 0.1, duration: 0.45 }}
                        className="w-full bg-[#6b6b70]"
                        style={{ minHeight: bucket.count > 0 ? 8 : 0 }}
                      />
                      <p className="text-center text-xs">{bucket.label}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </FadeCard>

          <FadeCard>
            <h2 className="text-2xl leading-none sm:text-3xl">Session Frequency by Member</h2>
            {memberFrequency.length === 0 ? (
              <p className="mt-3 text-sm text-[#4a7aab]">No members found.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {memberFrequency.map((member) => (
                  <div key={member.name} className="flex items-center gap-3 text-sm sm:text-base">
                    <span className="w-24 shrink-0 truncate">{member.name}</span>
                    <div className="flex-1 overflow-hidden border border-[#c3d9ee] bg-[#eef5ff]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((member.count / maxMember) * 100)}%` }}
                        transition={{ duration: 0.4 }}
                        className="h-5 bg-[#305175]"
                        style={{ minWidth: member.count > 0 ? 8 : 0 }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs tabular-nums">{member.count}</span>
                  </div>
                ))}
              </div>
            )}
          </FadeCard>
        </div>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Summary</h2>
          {totalWorkouts === 0 ? (
            <p className="mt-3 text-sm text-[#4a7aab]">Log workouts to generate insights.</p>
          ) : (
            <ul className="mt-3 space-y-1 text-base leading-tight sm:text-2xl">
              <li>Sessions: {totalWorkouts}</li>
              <li>Members active: {memberFrequency.filter((m) => m.count > 0).length}</li>
              <li>Top: {topMember ? topMember.name : "—"}</li>
              <li>
                Avg/member:{" "}
                {memberFrequency.length > 0
                  ? (totalWorkouts / memberFrequency.length).toFixed(1)
                  : "—"}
              </li>
            </ul>
          )}
        </FadeCard>
      </div>
    </AppShell>
  )
}
