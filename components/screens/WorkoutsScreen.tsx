"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { useMemo, useState } from "react"

const workouts = [
  "04/15 Mike T Back Squat 4x8 @185 RPE 7",
  "04/13 Sarah L Bench Press 5x5 @155 RPE 8",
  "04/12 Adam K Deadlift 3x5 @245 RPE 8",
]

export function WorkoutsScreen() {
  const [status, setStatus] = useState("Ready")
  const [savedCount, setSavedCount] = useState(0)
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null)

  const csvContent = useMemo(
    () => ["date,member,exercise,sets_reps,weight,rpe", ...workouts.map((w) => w.replace(/\s{2,}/g, " "))].join("\n"),
    []
  )

  const exportCsv = () => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "workouts-export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setStatus("CSV exported")
  }

  return (
    <AppShell
      title="Workouts"
      subtitle="Log sessions, track progression, and monitor coaching quality"
      actions={
        <>
          <MotionButton onClick={() => setStatus("Workout form focused")}>Add Workout</MotionButton>
          <MotionButton variant="secondary" onClick={exportCsv}>Export CSV</MotionButton>
        </>
      }
    >
      <FadeCard>
        <p className="text-xs sm:text-sm">Action Status: {status} {savedCount > 0 ? `| Saved: ${savedCount}` : ""}</p>
      </FadeCard>

      <FadeCard>
        <div className="grid gap-2 text-xs sm:grid-cols-2 sm:text-sm lg:grid-cols-4">
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]">
            <option>Member: All</option>
          </select>
          <input type="date" className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="2026-04-15" />
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]">
            <option>Type: Strength</option>
          </select>
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]">
            <option>Coach: Rob</option>
          </select>
        </div>
      </FadeCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Log Workout</h2>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
            <input className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="Back Squat" />
            <input className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="45 min" />
            <input className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="4 sets" />
            <input className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="8 reps" />
            <input className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="185 lbs" />
            <input className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]" defaultValue="RPE 7" />
            <textarea className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f] sm:col-span-2" rows={3} defaultValue="Felt strong through final two sets" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <MotionButton
              onClick={() => {
                setSavedCount((value) => value + 1)
                setStatus("Workout saved")
              }}
            >
              Save Workout
            </MotionButton>
            <MotionButton
              variant="secondary"
              onClick={() => {
                setSavedCount((value) => value + 1)
                setStatus("Workout saved and form reset for another entry")
              }}
            >
              Save + Add Another
            </MotionButton>
          </div>
        </FadeCard>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Session Snapshot</h2>
          <ul className="mt-3 space-y-1 text-base leading-tight sm:text-2xl">
            <li>Completed Today: 12</li>
            <li>Missed This Week: 3</li>
            <li>Avg. Intensity: RPE 7.2</li>
            <li>PR Alerts: 2 Pending</li>
          </ul>
        </FadeCard>
      </div>

      <FadeCard className="mt-4">
        <h2 className="text-xl leading-none sm:text-2xl">History (Newest First)</h2>
        <ul className="mt-3 space-y-1 text-xs leading-tight sm:text-sm">
          {workouts.map((item, index) => (
            <li
              key={item}
              className={`cursor-pointer border px-2 py-1 transition ${
                selectedHistory === index ? "border-[#1f6bc1] bg-[#eaf4ff]" : "border-transparent"
              }`}
              onClick={() => {
                setSelectedHistory(index)
                setStatus(`Selected history row ${index + 1}`)
              }}
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <MotionButton variant="ghost" onClick={() => setStatus("Viewing selected workout")}>View</MotionButton>
          <MotionButton variant="ghost" onClick={() => setStatus("Editing selected workout")}>Edit</MotionButton>
          <MotionButton variant="ghost" onClick={() => setStatus("Deleted selected workout")}>Delete</MotionButton>
          <MotionButton variant="ghost" onClick={() => setStatus("Duplicated selected workout")}>Duplicate</MotionButton>
        </div>
      </FadeCard>
    </AppShell>
  )
}
