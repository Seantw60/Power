"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export type MemberFormState = {
  status: "idle" | "success" | "error"
  message: string
  errors?: {
    name?: string
    email?: string
    age?: string
    goal?: string
  }
}

export async function createMember(
  _prevState: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  const user = await getCurrentUser()

  if (!user) {
    return { status: "error", message: "You must be logged in to add a member." }
  }

  const name = formData.get("name")?.toString().trim() ?? ""
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? ""
  const ageRaw = formData.get("age")?.toString().trim() ?? ""
  const goal = formData.get("goal")?.toString().trim() ?? ""

  const errors: MemberFormState["errors"] = {}

  if (!name) errors.name = "Name is required."

  if (!email) {
    errors.email = "Email is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address."
  }

  let age: number | null = null
  if (ageRaw) {
    const parsed = parseInt(ageRaw, 10)
    if (isNaN(parsed) || parsed < 1 || parsed > 120) {
      errors.age = "Age must be a number between 1 and 120."
    } else {
      age = parsed
    }
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the errors below.", errors }
  }

  try {
    const existing = await prisma.member.findUnique({ where: { email }, select: { id: true } })

    if (existing) {
      return { status: "error", message: "A member with that email already exists.", errors: { email: "Email already in use." } }
    }

    await prisma.member.create({
      data: {
        name,
        email,
        age,
        goal: goal || null,
        ownerId: user.id,
      },
    })
  } catch {
    return { status: "error", message: "Could not add member. Please try again." }
  }

  redirect("/members")
}
