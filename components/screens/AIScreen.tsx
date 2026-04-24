"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { motion } from "framer-motion"
import { useState } from "react"

const defaultInsight = [
  "Reduce total volume by 15% for five days.",
  "Keep intensity near RPE 7 on compound lifts.",
  "Add one extra rest day after heavy bench sessions.",
  "Re-check bar speed after deload block.",
]

export function AIScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [insight, setInsight] = useState(defaultInsight)
  const [status, setStatus] = useState("Ready")

  const handleGenerate = () => {
    setIsLoading(true)
    setStatus("Generating insight...")
    setTimeout(() => {
      setInsight([
        "Shift deload to Monday through Friday.",
        "Preserve bench intensity with reduced set count.",
        "Include tempo accessory work at lower load.",
        "Review recovery markers at day 6 check-in.",
      ])
      setIsLoading(false)
      setStatus("Insight generated")
    }, 900)
  }

  return (
    <AppShell
      title="AI Insights"
      subtitle="Build prompts, generate coaching suggestions, and track review status"
      actions={
        <>
          <MotionButton onClick={handleGenerate}>New Prompt</MotionButton>
          <MotionButton variant="secondary" onClick={() => setStatus("Saved to member plan")}>Save to Member Plan</MotionButton>
        </>
      }
    >
      <FadeCard>
        <p className="text-xs sm:text-sm">Action Status: {status}</p>
      </FadeCard>

      <FadeCard>
        <div className="grid gap-2 text-xs sm:grid-cols-2 sm:text-sm lg:grid-cols-4">
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Member: Sarah L</option></select>
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Goal: Strength</option></select>
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Time Horizon: 2 weeks</option></select>
          <select className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"><option>Confidence: Medium</option></select>
        </div>
        <textarea
          rows={3}
          defaultValue="Deload next week while preserving bench progress?"
          className="mt-3 w-full border border-[#89aed7] bg-white px-2 py-1 text-xs text-[#10233f] sm:text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <MotionButton onClick={handleGenerate}>Generate Insight</MotionButton>
          <MotionButton variant="ghost" onClick={handleGenerate}>Regenerate</MotionButton>
          <MotionButton
            variant="ghost"
            onClick={async () => {
              await navigator.clipboard.writeText(insight.join("\n"))
              setStatus("Insight copied to clipboard")
            }}
          >
            Copy
          </MotionButton>
          <MotionButton variant="ghost" onClick={() => setStatus("Insight attached to member check-in")}>Attach to Check-In</MotionButton>
        </div>
      </FadeCard>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">AI Insights</h2>
          {isLoading ? (
            <div className="mt-3 space-y-2">
              {[1, 2, 3].map((line) => (
                <motion.div
                  key={line}
                  className="h-6 border border-[#7a7a7a] bg-[#bebebe]"
                  animate={{ opacity: [0.35, 0.75, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1.1, delay: line * 0.08 }}
                />
              ))}
            </div>
          ) : (
            <ol className="mt-3 space-y-1 text-base leading-tight sm:text-2xl">
              {insight.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          )}
        </FadeCard>

        <FadeCard>
          <h2 className="text-2xl leading-none sm:text-3xl">Safety + Review</h2>
          <div className="mt-3 space-y-1 text-base leading-tight sm:text-2xl">
            <p>Coach review required before member delivery</p>
            <p>Confidence: Medium</p>
            <p>Last Updated: 3:42 PM</p>
          </div>
        </FadeCard>
      </div>

      <FadeCard className="mt-4">
        <h2 className="text-xl leading-none sm:text-2xl">Prompt / Response History</h2>
        <ul className="mt-3 space-y-1 text-xs leading-tight sm:text-2xl">
          <li>- 04/20 3:42 PM  Sarah L  "Deload timing"      Status: Reviewed</li>
          <li>- 04/18 1:12 PM  Mike T   "Plateau on squat"   Status: Needs follow-up</li>
          <li>- 04/16 9:04 AM  Adam K   "Recovery dip"       Status: Applied</li>
        </ul>
      </FadeCard>
    </AppShell>
  )
}
