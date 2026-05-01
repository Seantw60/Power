import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const SESSION_COOKIE_NAME = "power_session"

const SESSION_TTL_SECONDS = 60 * 60 * 24

export type AuthenticatedUser = {
  id: string
  email: string
  name: string | null
  role: string
}

export function getSessionTtlSeconds(): number {
  return SESSION_TTL_SECONDS
}

export function createSessionExpiresAt(): Date {
  return new Date(Date.now() + SESSION_TTL_SECONDS * 1000)
}

export function getSessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  }
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) {
    return null
  }

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  })

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME)
    return null
  }

  return session.user
}

export async function requireUser(fromPath = "/dashboard"): Promise<AuthenticatedUser> {
  const user = await getCurrentUser()

  if (!user) {
    const encodedFrom = encodeURIComponent(fromPath)
    redirect(`/login?from=${encodedFrom}`)
  }

  return user
}
