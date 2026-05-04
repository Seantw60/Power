import { getCurrentUser } from "@/lib/session"
import {
  deleteWorkoutForUser,
  saveWorkoutForUser,
  updateWorkoutForUser,
  validateWorkoutDeleteInput,
  validateWorkoutInput,
  validateWorkoutUpdateInput,
  workoutDeleteInputFromJson,
  workoutInputFromJson,
  workoutUpdateInputFromJson,
} from "@/lib/workouts"
import { NextResponse } from "next/server"

type WorkoutRequestBody = {
  workoutId?: string
  memberId?: string
  exerciseName?: string
  sets?: string | number
  reps?: string | number
  weight?: string | number
  notes?: string
  date?: string
}

async function requestBodyAsJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = (await request.json()) as Record<string, unknown>
    return body
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { message: "You must be logged in to create workouts." },
      { status: 401 },
    )
  }

  const body = (await request.json()) as WorkoutRequestBody
  const input = workoutInputFromJson(body as Record<string, unknown>)
  const { errors, parsed } = validateWorkoutInput(input)

  if (!parsed) {
    return NextResponse.json(
      { message: "Please fix the validation errors.", errors },
      { status: 400 },
    )
  }

  const member = await saveWorkoutForUser(user.id, parsed)

  if (!member) {
    return NextResponse.json(
      { message: "Member not found for this gym owner." },
      { status: 404 },
    )
  }

  return NextResponse.json(
    { ok: true, message: `Workout saved for ${member.name}` },
    { status: 201 },
  )
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { message: "You must be logged in to update workouts." },
      { status: 401 },
    )
  }

  const body = await requestBodyAsJson(request)

  if (!body) {
    return NextResponse.json(
      { message: "Invalid JSON request body." },
      { status: 400 },
    )
  }

  const input = workoutUpdateInputFromJson(body as WorkoutRequestBody as Record<string, unknown>)
  const { errors, parsed } = validateWorkoutUpdateInput(input)

  if (!parsed) {
    return NextResponse.json(
      { message: "Please fix the validation errors.", errors },
      { status: 400 },
    )
  }

  try {
    const workout = await updateWorkoutForUser(user.id, parsed)

    if (!workout) {
      return NextResponse.json(
        { message: "Workout not found for this gym owner." },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { ok: true, message: `Workout updated for ${workout.member.name}` },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      { message: "Could not update workout. Please try again." },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { message: "You must be logged in to delete workouts." },
      { status: 401 },
    )
  }

  const body = await requestBodyAsJson(request)

  if (!body) {
    return NextResponse.json(
      { message: "Invalid JSON request body." },
      { status: 400 },
    )
  }

  const input = workoutDeleteInputFromJson(body as WorkoutRequestBody as Record<string, unknown>)
  const { errors, parsed } = validateWorkoutDeleteInput(input)

  if (!parsed) {
    return NextResponse.json(
      { message: "Could not delete workout.", errors },
      { status: 400 },
    )
  }

  try {
    const workout = await deleteWorkoutForUser(user.id, parsed)

    if (!workout) {
      return NextResponse.json(
        { message: "Workout not found for this gym owner." },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { ok: true, message: `Deleted workout for ${workout.member.name}` },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      { message: "Could not delete workout. Please try again." },
      { status: 500 },
    )
  }
}
