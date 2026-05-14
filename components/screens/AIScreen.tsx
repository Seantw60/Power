"use client"

import { AppShell, FadeCard } from "@/components/AppShell"
import { MotionButton } from "@/components/ui/MotionButton"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"

type MemberOption = {
  id: string
  name: string
  goal: string | null
}

type AIScreenProps = {
  members: MemberOption[]
}

type InsightHistoryItem = {
  id: string
  timestamp: string
  memberName: string
  prompt: string
  status: string
}

const horizons = ["1 week", "2 weeks", "4 weeks"]
const confidenceLevels = ["Low", "Medium", "High"]

const defaultPrompt = "Deload next week while preserving bench progress?"

export function AIScreen({ members }: AIScreenProps) {
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id ?? "")
  const [requestedGoal, setRequestedGoal] = useState(members[0]?.goal ?? "Strength")
  const [horizon, setHorizon] = useState("2 weeks")
  const [confidence, setConfidence] = useState("Medium")
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [isLoading, setIsLoading] = useState(false)
  const [insight, setInsight] = useState<string[]>([])
  const [status, setStatus] = useState("Ready")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [history, setHistory] = useState<InsightHistoryItem[]>([])

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId),
    [members, selectedMemberId],
  )

  const hasMembers = members.length > 0

  const formatTimestamp = () =>
    new Date().toLocaleString([], {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleGenerate = async () => {
    if (!selectedMemberId) {
      setErrorMessage("Please add and select a member before generating insights.")
      return
    }

    if (!prompt.trim()) {
      setErrorMessage("Please enter a coaching question before generating insights.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setStatus("Generating insight...")

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: selectedMemberId,
          requestedGoal,
          horizon,
          confidence,
          prompt,
        }),
      })

      const payload = (await response.json()) as {
        message?: string
        memberName?: string
        insights?: string[]
      }

      if (!response.ok) {
        setErrorMessage(payload.message ?? "Could not generate AI insight right now.")
        setStatus("Generation failed")
        return
      }

      const nextInsight = Array.isArray(payload.insights) ? payload.insights : []
      setInsight(nextInsight)
      setStatus(`Insight generated for ${payload.memberName ?? "member"}`)
      setHistory((previous) => [
        {
          id: crypto.randomUUID(),
          timestamp: formatTimestamp(),
          memberName: payload.memberName ?? selectedMember?.name ?? "Unknown member",
          prompt: prompt.trim(),
          status: "Generated",
        },
        ...previous,
      ].slice(0, 6))
    } catch {
      setErrorMessage("Could not generate AI insight right now. Please try again.")
      setStatus("Generation failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMemberChange = (memberId: string) => {
    setSelectedMemberId(memberId)
    const nextMember = members.find((member) => member.id === memberId)

    if (nextMember?.goal) {
      setRequestedGoal(nextMember.goal)
    }
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

      {!hasMembers ? (
        <FadeCard>
          <p className="text-sm sm:text-base">No members found. Add a member and at least one workout before using AI insights.</p>
        </FadeCard>
      ) : null}

      <FadeCard>
        <div className="grid gap-2 text-xs sm:grid-cols-2 sm:text-sm lg:grid-cols-4">
          <select
            value={selectedMemberId}
            onChange={(event) => handleMemberChange(event.target.value)}
            className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
            disabled={!hasMembers || isLoading}
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                Member: {member.name}
              </option>
            ))}
          </select>
          <input
            value={requestedGoal}
            onChange={(event) => setRequestedGoal(event.target.value)}
            className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
            placeholder="Goal focus"
            disabled={!hasMembers || isLoading}
          />
          <select
            value={horizon}
            onChange={(event) => setHorizon(event.target.value)}
            className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
            disabled={!hasMembers || isLoading}
          >
            {horizons.map((value) => (
              <option key={value} value={value}>
                Time Horizon: {value}
              </option>
            ))}
          </select>
          <select
            value={confidence}
            onChange={(event) => setConfidence(event.target.value)}
            className="border border-[#89aed7] bg-white px-2 py-1 text-[#10233f]"
            disabled={!hasMembers || isLoading}
          >
            {confidenceLevels.map((value) => (
              <option key={value} value={value}>
                Confidence: {value}
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows={3}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="mt-3 w-full border border-[#89aed7] bg-white px-2 py-1 text-xs text-[#10233f] sm:text-sm"
          disabled={!hasMembers || isLoading}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <MotionButton onClick={handleGenerate} disabled={!hasMembers || isLoading}>Generate Insight</MotionButton>
          <MotionButton variant="ghost" onClick={handleGenerate} disabled={!hasMembers || isLoading}>Regenerate</MotionButton>
          <MotionButton
            variant="ghost"
            onClick={async () => {
              if (insight.length === 0) {
                return
              }

              await navigator.clipboard.writeText(insight.join("\n"))
              setStatus("Insight copied to clipboard")
            }}
            disabled={insight.length === 0 || isLoading}
          >
            Copy
          </MotionButton>
          <MotionButton
            variant="ghost"
            onClick={() => setStatus("Insight attached to member check-in")}
            disabled={insight.length === 0 || isLoading}
          >
            Attach to Check-In
          </MotionButton>
        </div>
        {errorMessage ? <p className="mt-2 text-xs text-[#8d1d1d] sm:text-sm">{errorMessage}</p> : null}
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
          ) : insight.length === 0 ? (
            <p className="mt-3 text-sm sm:text-base">Generate an insight to see coaching recommendations here.</p>
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
            <p>Confidence: {confidence}</p>
            <p>Last Updated: {history[0]?.timestamp ?? "Not generated yet"}</p>
          </div>
        </FadeCard>
      </div>

      <FadeCard className="mt-4">
        <h2 className="text-xl leading-none sm:text-2xl">Prompt / Response History</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-xs sm:text-sm">No prompt history yet.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-xs leading-tight sm:text-sm">
            {history.map((item) => (
              <li key={item.id}>
                - {item.timestamp} {item.memberName} "{item.prompt}" Status: {item.status}
              </li>
            ))}
          </ul>
        )}
      </FadeCard>
    </AppShell>
  )
}
