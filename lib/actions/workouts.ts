"use server"

import { prisma } from "@/lib/prisma"
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
  }
}

export async function createWorkout(
  _prev: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  const memberId = formData.get("memberId")?.toString().trim() ?? ""
  const exerciseName = formData.get("exerciseName")?.toString().trim() ?? ""
  const setsRaw = formData.get("sets")?.toString().trim() ?? ""
  const repsRaw = formData.get("reps")?.toString().trim() ?? ""
  const weightRaw = formData.get("weight")?.toString().trim() ?? ""
  const notes = formData.get("notes")?.toString().trim() ?? ""
  const date = formData.get("date")?.toString().trim() ?? new Date().toISOString().slice(0, 10)

  // Validation
  const errors: WorkoutFormState["errors"] = {}

  if (!memberId) errors.memberId = "Please select a member"
  if (!exerciseName) errors.exerciseName = "Exercise name is required"

  const sets = parseInt(setsRaw, 10)
  if (!setsRaw || isNaN(sets) || sets < 1) errors.sets = "Sets must be a number greater than 0"

  const reps = parseInt(repsRaw, 10)
  if (!repsRaw || isNaN(reps) || reps < 1) errors.reps = "Reps must be a number greater than 0"

  const weight = weightRaw ? parseFloat(weightRaw) : null
  if (weightRaw && isNaN(weight!)) errors.weight = "Weight must be a valid number"

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the errors below", errors }
  }

  // Look up the demo gym owner
  const user = await prisma.user.findUnique({
    where: { email: "rob@launchpadphilly.org" },
  })

  if (!user) {
    return { status: "error", message: "Session user not found. Please log in again." }
  }

  // Verify the member belongs to this gym owner
  const member = await prisma.member.findFirst({
    where: { id: memberId, gymOwnerId: user.id },
  })

  if (!member) {
    return { status: "error", message: "Member not found." }
  }

  await prisma.workout.create({
    data: {
      memberId: member.id,
      userId: user.id,
      date: new Date(date),
      notes: notes || null,
      items: {
        create: {
          exerciseName,
          sets,
          reps,
          weight,
        },
      },
    },
  })

  revalidatePath("/workouts")

  return { status: "success", message: `Workout saved for ${member.name}` }
}
