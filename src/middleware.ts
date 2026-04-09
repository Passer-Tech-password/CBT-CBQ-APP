import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get("auth-token")?.value
  const userRole = request.cookies.get("user-role")?.value

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isAdminPage = pathname.startsWith("/admin")
  const isDashboardPage = pathname.startsWith("/dashboard")

  // 1. Not logged in -> Redirect to login if trying to access protected routes
  if (!authToken && (isAdminPage || isDashboardPage)) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Logged in -> Redirect away from auth pages
  if (authToken && isAuthPage) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 3. Role-based protection
  if (authToken) {
    // Admin trying to access student dashboard
    if (userRole === "admin" && isDashboardPage) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    
    // Student trying to access admin pages
    if (userRole === "student" && isAdminPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
}
