import { getCurrentUser } from "@/lib/session"
import {
  saveWorkoutForUser,
  validateWorkoutInput,
  workoutInputFromJson,
} from "@/lib/workouts"
import { NextResponse } from "next/server"

type WorkoutRequestBody = {
  memberId?: string
  exerciseName?: string
  sets?: string | number
  reps?: string | number
  weight?: string | number
  notes?: string
  date?: string
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
