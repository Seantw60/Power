import OpenAI from "openai"

export type WorkoutContextItem = {
  date: Date
  notes: string | null
  items: Array<{
    exerciseName: string
    sets: number
    reps: number
    weight: number | null
  }>
}

export type GenerateInsightInput = {
  memberName: string
  memberGoal: string | null
  requestedGoal: string
  horizon: string
  confidence: string
  coachPrompt: string
  workouts: WorkoutContextItem[]
}

type AIResponseShape = {
  insights?: unknown
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.")
  }

  return new OpenAI({ apiKey })
}

function formatWeight(weight: number | null): string {
  if (weight === null) {
    return "bodyweight/unspecified"
  }

  return `${weight} lbs`
}

export function buildWorkoutContext(workouts: WorkoutContextItem[]): string {
  if (workouts.length === 0) {
    return "No workout history is available for this member yet."
  }

  return workouts
    .map((workout, workoutIndex) => {
      const lineItems = workout.items
        .map((item) => {
          return `${item.exerciseName}: ${item.sets}x${item.reps} @ ${formatWeight(item.weight)}`
        })
        .join("; ")

      const dateLabel = workout.date.toISOString().slice(0, 10)
      const notes = workout.notes?.trim() ? ` Notes: ${workout.notes.trim()}` : ""
      return `${workoutIndex + 1}. ${dateLabel} - ${lineItems}.${notes}`
    })
    .join("\n")
}

export function parseInsightsFromModelText(rawText: string): string[] {
  const trimmed = rawText.trim()

  if (!trimmed) {
    return []
  }

  try {
    const parsed = JSON.parse(trimmed) as AIResponseShape

    if (Array.isArray(parsed.insights)) {
      return parsed.insights
        .map((item) => item?.toString().trim())
        .filter((item): item is string => Boolean(item))
        .slice(0, 6)
    }
  } catch {
    // Fall back to line parsing below.
  }

  return trimmed
    .split("\n")
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 6)
}

export async function generateCoachingInsights(input: GenerateInsightInput): Promise<string[]> {
  const client = getOpenAIClient()
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"

  const systemPrompt = [
    "You are a strength coach assistant for gym owners.",
    "Return only practical coaching bullets with no disclaimers.",
    "Respond as JSON with this exact shape: {\"insights\":[\"...\"]}.",
    "Provide 3 to 5 concise insights.",
    "Use member history to justify progression, deloads, and recovery pacing.",
  ].join(" ")

  const userPrompt = [
    `Member: ${input.memberName}`,
    `Member goal on profile: ${input.memberGoal ?? "Not set"}`,
    `Requested focus: ${input.requestedGoal}`,
    `Time horizon: ${input.horizon}`,
    `Desired confidence level: ${input.confidence}`,
    `Coach request: ${input.coachPrompt}`,
    "Recent workout context:",
    buildWorkoutContext(input.workouts),
  ].join("\n")

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  })

  const responseText = completion.choices[0]?.message?.content?.toString() ?? ""
  const insights = parseInsightsFromModelText(responseText)

  if (insights.length === 0) {
    return [
      "Keep the next week conservative while monitoring fatigue and recovery.",
      "Maintain one primary lift focus and reduce accessory volume by 10 to 20%.",
      "Review sleep, soreness, and bar-speed trends before increasing load again.",
    ]
  }

  return insights
}