import { generateCoachingInsights } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { NextResponse } from "next/server"

type AIRequestBody = {
  memberId?: string
  requestedGoal?: string
  horizon?: string
  confidence?: string
  prompt?: string
}

function bodyToInput(body: Record<string, unknown>): AIRequestBody {
  return {
    memberId: body.memberId?.toString().trim() ?? "",
    requestedGoal: body.requestedGoal?.toString().trim() ?? "General performance",
    horizon: body.horizon?.toString().trim() ?? "2 weeks",
    confidence: body.confidence?.toString().trim() ?? "Medium",
    prompt: body.prompt?.toString().trim() ?? "",
  }
}

async function requestBodyAsJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ message: "You must be logged in to use AI insights." }, { status: 401 })
  }

  const body = await requestBodyAsJson(request)

  if (!body) {
    return NextResponse.json({ message: "Invalid JSON request body." }, { status: 400 })
  }

  const input = bodyToInput(body)

  if (!input.memberId) {
    return NextResponse.json({ message: "Please select a member." }, { status: 400 })
  }

  if (!input.prompt) {
    return NextResponse.json({ message: "Please add a coaching prompt." }, { status: 400 })
  }

  const member = await prisma.member.findFirst({
    where: { id: input.memberId, ownerId: user.id },
    select: {
      id: true,
      name: true,
      goal: true,
    },
  })

  if (!member) {
    return NextResponse.json({ message: "Member not found for this gym owner." }, { status: 404 })
  }

  const workouts = await prisma.workout.findMany({
    where: { userId: user.id, memberId: member.id },
    include: {
      items: {
        select: {
          exerciseName: true,
          sets: true,
          reps: true,
          weight: true,
        },
      },
    },
    orderBy: { date: "desc" },
    take: 8,
  })

  if (workouts.length === 0) {
    return NextResponse.json(
      { message: "No workout history found for this member yet. Log at least one workout first." },
      { status: 400 },
    )
  }

  try {
    const insights = await generateCoachingInsights({
      memberName: member.name,
      memberGoal: member.goal,
      requestedGoal: input.requestedGoal ?? "General performance",
      horizon: input.horizon ?? "2 weeks",
      confidence: input.confidence ?? "Medium",
      coachPrompt: input.prompt,
      workouts,
    })

    return NextResponse.json(
      {
        ok: true,
        memberName: member.name,
        insights,
        workoutCount: workouts.length,
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error && error.message.includes("OPENAI_API_KEY")
      ? "AI provider is not configured. Set OPENAI_API_KEY in your environment."
      : "Could not generate AI insight right now. Please try again."

    return NextResponse.json({ message }, { status: 500 })
  }
}