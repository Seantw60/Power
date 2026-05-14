import {
  validateWorkoutDeleteInput,
  validateWorkoutInput,
  validateWorkoutUpdateInput,
  workoutDeleteInputFromJson,
  workoutInputFromJson,
  workoutUpdateInputFromJson,
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

  it("rejects a negative weight value", () => {
    const input = workoutInputFromJson({
      memberId: "member-1",
      exerciseName: "Back Squat",
      sets: 4,
      reps: 8,
      weight: -25,
      notes: "Testing negative value",
      date: "2026-05-01",
    })

    const result = validateWorkoutInput(input)

    expect(result.parsed).toBeNull()
    expect(result.errors.weight).toBe("Weight cannot be negative")
  })

  it("accepts a valid workout update payload", () => {
    const input = workoutUpdateInputFromJson({
      workoutId: "workout-1",
      notes: "Felt strong across all sets",
      date: "2026-05-03",
    })

    const result = validateWorkoutUpdateInput(input)

    expect(result.parsed).not.toBeNull()
    expect(result.errors).toEqual({})
    expect(result.parsed?.workoutId).toBe("workout-1")
    expect(result.parsed?.notes).toBe("Felt strong across all sets")
  })

  it("rejects a workout update payload with missing id and notes", () => {
    const input = workoutUpdateInputFromJson({
      workoutId: "",
      notes: "",
      date: "2026-05-03",
    })

    const result = validateWorkoutUpdateInput(input)

    expect(result.parsed).toBeNull()
    expect(result.errors.workoutId).toBeDefined()
    expect(result.errors.notes).toBeDefined()
  })

  it("accepts a valid workout delete payload", () => {
    const input = workoutDeleteInputFromJson({
      workoutId: "workout-1",
    })

    const result = validateWorkoutDeleteInput(input)

    expect(result.parsed).not.toBeNull()
    expect(result.errors).toEqual({})
    expect(result.parsed?.workoutId).toBe("workout-1")
  })

  it("rejects a workout delete payload with missing id", () => {
    const input = workoutDeleteInputFromJson({
      workoutId: "",
    })

    const result = validateWorkoutDeleteInput(input)

    expect(result.parsed).toBeNull()
    expect(result.errors.workoutId).toBeDefined()
  })
})
