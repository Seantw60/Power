"use server"

import { getCurrentUser } from "@/lib/session"
import {
  deleteWorkoutForUser,
  saveWorkoutForUser,
  updateWorkoutForUser,
  validateWorkoutDeleteInput,
  validateWorkoutInput,
  validateWorkoutUpdateInput,
  workoutDeleteInputFromFormData,
  workoutInputFromFormData,
  workoutUpdateInputFromFormData,
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

export type WorkoutEditFormState = {
  status: "idle" | "success" | "error"
  message: string
  errors?: {
    workoutId?: string
    notes?: string
    date?: string
  }
}

export type WorkoutDeleteFormState = {
  status: "idle" | "success" | "error"
  message: string
  errors?: {
    workoutId?: string
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

export async function updateWorkout(
  _prev: WorkoutEditFormState,
  formData: FormData,
): Promise<WorkoutEditFormState> {
  const input = workoutUpdateInputFromFormData(formData)
  const { errors, parsed } = validateWorkoutUpdateInput(input)

  if (!parsed) {
    return { status: "error", message: "Please fix the errors below", errors }
  }

  const user = await getCurrentUser()

  if (!user) {
    return { status: "error", message: "Session user not found. Please log in again." }
  }

  try {
    const workout = await updateWorkoutForUser(user.id, parsed)

    if (!workout) {
      return { status: "error", message: "Workout not found." }
    }

    revalidatePath("/workouts")

    return {
      status: "success",
      message: `Workout updated for ${workout.member.name}`,
    }
  } catch {
    return {
      status: "error",
      message: "Could not update workout. Please try again.",
    }
  }
}

export async function deleteWorkout(
  _prev: WorkoutDeleteFormState,
  formData: FormData,
): Promise<WorkoutDeleteFormState> {
  const input = workoutDeleteInputFromFormData(formData)
  const { errors, parsed } = validateWorkoutDeleteInput(input)

  if (!parsed) {
    return { status: "error", message: "Could not delete workout.", errors }
  }

  const user = await getCurrentUser()

  if (!user) {
    return { status: "error", message: "Session user not found. Please log in again." }
  }

  try {
    const workout = await deleteWorkoutForUser(user.id, parsed)

    if (!workout) {
      return { status: "error", message: "Workout not found." }
    }

    revalidatePath("/workouts")

    return {
      status: "success",
      message: `Deleted workout for ${workout.member.name}`,
    }
  } catch {
    return {
      status: "error",
      message: "Could not delete workout. Please try again.",
    }
  }
}
