import { prisma } from "@/lib/prisma"
import {
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/session"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (sessionId) {
    await prisma.session.deleteMany({
      where: { id: sessionId },
    })
  }

  const response = NextResponse.json({ ok: true })

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...getSessionCookieOptions(0),
    maxAge: 0,
  })

  return response
}
