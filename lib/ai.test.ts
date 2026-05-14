import { buildWorkoutContext, parseInsightsFromModelText } from "@/lib/ai"
import { describe, expect, it } from "vitest"

describe("ai utilities", () => {
  it("formats workout context with exercise details and notes", () => {
    const context = buildWorkoutContext([
      {
        date: new Date("2026-05-10"),
        notes: "Strong session",
        items: [
          {
            exerciseName: "Bench Press",
            sets: 4,
            reps: 5,
            weight: 185,
          },
          {
            exerciseName: "Pull Up",
            sets: 3,
            reps: 8,
            weight: null,
          },
        ],
      },
    ])

    expect(context).toContain("Bench Press: 4x5 @ 185 lbs")
    expect(context).toContain("Pull Up: 3x8 @ bodyweight/unspecified")
    expect(context).toContain("Notes: Strong session")
  })

  it("parses JSON model output into an insight list", () => {
    const insights = parseInsightsFromModelText(
      '{"insights":["Reduce squat volume by 15% this week","Keep top-set intensity at RPE 7"]}',
    )

    expect(insights).toHaveLength(2)
    expect(insights[0]).toContain("Reduce squat volume")
  })

  it("falls back to line parsing for plain text model output", () => {
    const insights = parseInsightsFromModelText(
      "1. Keep Monday heavy day\n2. Add a recovery day\n- Recheck readiness on Friday",
    )

    expect(insights).toEqual([
      "Keep Monday heavy day",
      "Add a recovery day",
      "Recheck readiness on Friday",
    ])
  })
})