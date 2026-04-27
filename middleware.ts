import { NextRequest, NextResponse } from "next/server"

const PROTECTED_ROUTES = ["/dashboard", "/workouts", "/analytics", "/ai", "/profile"]
const LOGIN_PATH = "/login"
const SESSION_COOKIE = "power_session"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  if (!isProtected) {
    return NextResponse.next()
  }

  const session = request.cookies.get(SESSION_COOKIE)

  if (!session) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/workouts/:path*", "/analytics/:path*", "/ai/:path*", "/profile/:path*"],
}
