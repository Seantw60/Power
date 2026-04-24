"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

const monthlyVolume = [84, 91, 98, 102]

export function AnalyticsScreen() {
  const [status, setStatus] = useState("Ready")
  const [compareMode, setCompareMode] = useState(false)

  const reportText = useMemo(
    () => `Power Analytics Report\nRange: 30d\nMetric: Volume\nCompare mode: ${compareMode ? "ON" : "OFF"}`,
    [compareMode]
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
          <MotionButton
            onClick={() => {
              setCompareMode((value) => !value)
              setStatus(compareMode ? "Compare mode disabled" : "Compare mode enabled")
            }}
          >
            Compare Periods
          </MotionButton>
          <MotionButton variant="secondary" onClick={exportReport}>Export PDF</MotionButton>
        </>
      }
    >
      <FadeCard>
        <p className="text-xs sm:text-sm">Action Status: {status}</p>
      </FadeCard>

      <FadeCard>
        <div className="grid gap-2 text-xs sm:grid-cols-2 sm:text-sm lg:grid-cols-5">
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Range: 30d</option></select>
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Member: All</option></select>
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Metric: Volume</option></select>
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Segment: All</option></select>
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Trend: Weekly</option></select>
        </div>
      </FadeCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <FadeCard>
            <h2 className="text-2xl leading-none sm:text-3xl">Volume Trend</h2>
            <p className="mt-1 text-sm sm:text-xl">Jan: 8.4k  Feb: 9.1k  Mar: 9.8k  Apr: 10.2k</p>
            <div className="mt-4 flex items-end gap-3">
              {monthlyVolume.map((value, index) => (
                <div key={value} className="flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ delay: index * 0.1, duration: 0.45 }}
                    className="w-full bg-[#6b6b70]"
                    style={{ minHeight: 28 }}
                  />
                  <p className="mt-2 text-center text-xs">M{index + 1}</p>
                </div>
              ))}
            </div>
          </FadeCard>

          <FadeCard>
            <h2 className="text-2xl leading-none sm:text-3xl">Session Frequency by Member</h2>
            <div className="mt-3 space-y-1 text-base leading-tight sm:text-2xl">
              <p>Mike T: 4/wk  Sarah L: 3/wk  Adam K: 2/wk</p>
              <p>(Bar chart with goal marker at 3 sessions)</p>
            </div>
          </FadeCard>
        </div>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Insights Summary</h2>
          <div className="mt-3 space-y-1 text-base leading-tight sm:text-2xl">
            <p>Top Improver: Sarah L</p>
            <p>At-Risk: 5 members</p>
            <p>Adherence: 82% avg</p>
            <p>Recovery Flags: 3</p>
          </div>
          <h3 className="mt-4 text-xl leading-none sm:text-2xl">Coaching Recommendations</h3>
          <ul className="mt-2 space-y-1 text-sm leading-tight sm:text-2xl">
            <li>- Increase lower-body volume 10% for members above 90% adherence</li>
            <li>- Trigger outreach when attendance drops below 2 sessions for 2 weeks</li>
            <li>- Schedule deload guidance for high-fatigue group next micro-cycle</li>
          </ul>
        </FadeCard>
      </div>
    </AppShell>
  )
}
