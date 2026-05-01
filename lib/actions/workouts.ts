"use server"

import { getCurrentUser } from "@/lib/session"
import {
  saveWorkoutForUser,
  validateWorkoutInput,
  workoutInputFromFormData,
} from "@/lib/workouts"
import { revalidatePath } from "next/cache"

export type WorkoutFormState = {
  status: "idle" | "success" | "error"
  message: string
  errors?: {
    memberId?: string
    exerciseName?: string
    sets?: string
    reps?: string
    weight?: string
    notes?: string
    date?: string
  }
}

export async function createWorkout(
  _prev: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  const input = workoutInputFromFormData(formData)
  const { errors, parsed } = validateWorkoutInput(input)

  if (!parsed) {
    return { status: "error", message: "Please fix the errors below", errors }
  }

  const user = await getCurrentUser()

  if (!user) {
    return { status: "error", message: "Session user not found. Please log in again." }
  }

  const member = await saveWorkoutForUser(user.id, parsed)

  if (!member) {
    return { status: "error", message: "Member not found." }
  }

  revalidatePath("/workouts")

  return { status: "success", message: `Workout saved for ${member.name}` }
}
