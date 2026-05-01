import {
  validateWorkoutInput,
  workoutInputFromJson,
} from "@/lib/workouts"
import { describe, expect, it } from "vitest"

describe("workout validation", () => {
  it("accepts a valid workout payload", () => {
    const input = workoutInputFromJson({
      memberId: "member-1",
      exerciseName: "Back Squat",
      sets: 4,
      reps: 8,
      weight: 185,
      notes: "Strong today",
      date: "2026-05-01",
    })

    const result = validateWorkoutInput(input)

    expect(result.parsed).not.toBeNull()
    expect(result.errors).toEqual({})
    expect(result.parsed?.sets).toBe(4)
    expect(result.parsed?.reps).toBe(8)
  })

  it("rejects missing required workout fields", () => {
    const input = workoutInputFromJson({
      memberId: "",
      exerciseName: "",
      sets: "",
      reps: "",
      weight: "",
      notes: "",
      date: "2026-05-01",
    })

    const result = validateWorkoutInput(input)

    expect(result.parsed).toBeNull()
    expect(result.errors.memberId).toBeDefined()
    expect(result.errors.exerciseName).toBeDefined()
    expect(result.errors.sets).toBeDefined()
    expect(result.errors.reps).toBeDefined()
    expect(result.errors.notes).toBeDefined()
  })
})
