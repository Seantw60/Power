import { verifyPassword } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  createSessionExpiresAt,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/session"
import { NextResponse } from "next/server"

type LoginBody = {
  email?: string
  password?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody
  const email = body.email?.toString().trim().toLowerCase() ?? ""
  const password = body.password?.toString() ?? ""

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    )
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
    },
  })

  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    )
  }

  const isValidPassword = await verifyPassword(password, user.password)

  if (!isValidPassword) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    )
  }

  const expiresAt = createSessionExpiresAt()

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt,
    },
    select: { id: true },
  })

  const response = NextResponse.json({ ok: true })

  response.cookies.set(
    SESSION_COOKIE_NAME,
    session.id,
    getSessionCookieOptions(),
  )

  return response
}
