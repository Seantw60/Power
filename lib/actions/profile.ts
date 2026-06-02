"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"

export type ProfileFormState = {
  status: "idle" | "success" | "error"
  message: string
  errors?: {
    name?: string
    email?: string
  }
}

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getCurrentUser()

  if (!user) {
    return { status: "error", message: "You must be logged in to update your profile." }
  }

  const name = formData.get("name")?.toString().trim() ?? ""
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? ""

  const errors: ProfileFormState["errors"] = {}

  if (!name) {
    errors.name = "Name is required."
  }

  if (!email) {
    errors.email = "Email is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address."
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the errors below.", errors }
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: user.id } },
      select: { id: true },
    })

    if (existing) {
      return { status: "error", message: "That email is already in use.", errors: { email: "Email already taken." } }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name, email },
    })

    return { status: "success", message: "Profile saved." }
  } catch {
    return { status: "error", message: "Could not save profile. Please try again." }
  }
}
