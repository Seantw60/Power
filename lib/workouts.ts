import { prisma } from "@/lib/prisma"

export type WorkoutInput = {
  memberId: string
  exerciseName: string
  sets: string
  reps: string
  weight: string
  notes: string
  date: string
}

export type WorkoutValidationErrors = {
  memberId?: string
  exerciseName?: string
  sets?: string
  reps?: string
  weight?: string
  notes?: string
  date?: string
}

export type ParsedWorkoutInput = {
  memberId: string
  exerciseName: string
  sets: number
  reps: number
  weight: number | null
  notes: string
  date: Date
}

export function workoutInputFromFormData(formData: FormData): WorkoutInput {
  return {
    memberId: formData.get("memberId")?.toString().trim() ?? "",
    exerciseName: formData.get("exerciseName")?.toString().trim() ?? "",
    sets: formData.get("sets")?.toString().trim() ?? "",
    reps: formData.get("reps")?.toString().trim() ?? "",
    weight: formData.get("weight")?.toString().trim() ?? "",
    notes: formData.get("notes")?.toString().trim() ?? "",
    date: formData.get("date")?.toString().trim() ?? "",
  }
}

export function workoutInputFromJson(body: Record<string, unknown>): WorkoutInput {
  return {
    memberId: body.memberId?.toString().trim() ?? "",
    exerciseName: body.exerciseName?.toString().trim() ?? "",
    sets: body.sets?.toString().trim() ?? "",
    reps: body.reps?.toString().trim() ?? "",
    weight: body.weight?.toString().trim() ?? "",
    notes: body.notes?.toString().trim() ?? "",
    date: body.date?.toString().trim() ?? "",
  }
}

export function validateWorkoutInput(input: WorkoutInput): {
  errors: WorkoutValidationErrors
  parsed: ParsedWorkoutInput | null
} {
  const errors: WorkoutValidationErrors = {}

  if (!input.memberId) errors.memberId = "Please select a member"
  if (!input.exerciseName) errors.exerciseName = "Exercise name is required"
  if (!input.notes) errors.notes = "Workout notes are required"

  const sets = parseInt(input.sets, 10)
  if (!input.sets || Number.isNaN(sets) || sets < 1) {
    errors.sets = "Sets must be a number greater than 0"
  }

  const reps = parseInt(input.reps, 10)
  if (!input.reps || Number.isNaN(reps) || reps < 1) {
    errors.reps = "Reps must be a number greater than 0"
  }

  const weight = input.weight ? parseFloat(input.weight) : null
  if (input.weight && Number.isNaN(weight as number)) {
    errors.weight = "Weight must be a valid number"
  }

  const dateString = input.date || new Date().toISOString().slice(0, 10)
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    errors.date = "Workout date is invalid"
  }

  if (Object.keys(errors).length > 0) {
    return { errors, parsed: null }
  }

  return {
    errors,
    parsed: {
      memberId: input.memberId,
      exerciseName: input.exerciseName,
      sets,
      reps,
      weight,
      notes: input.notes,
      date,
    },
  }
}

export async function saveWorkoutForUser(userId: string, input: ParsedWorkoutInput) {
  const member = await prisma.member.findFirst({
    where: { id: input.memberId, ownerId: userId },
  })

  if (!member) {
    return null
  }

  await prisma.workout.create({
    data: {
      memberId: member.id,
      userId,
      date: input.date,
      notes: input.notes,
      items: {
        create: {
          exerciseName: input.exerciseName,
          sets: input.sets,
          reps: input.reps,
          weight: input.weight,
        },
      },
    },
  })

  return member
}
