import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Use 'session' cookie (HttpOnly) for auth instead of client-side 'auth-token'
  const session = request.cookies.get("session")?.value
  const userRole = request.cookies.get("user-role")?.value

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isAdminPage = pathname.startsWith("/admin")
  const isDashboardPage = pathname.startsWith("/dashboard")

  // 1. Not logged in (no session cookie) -> Redirect to login
  if (!session && (isAdminPage || isDashboardPage)) {
    const loginUrl = new URL("/login", request.url)
    // Clear potentially lingering role cookies if no session
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete("user-role")
    return response
  }

  // 2. Logged in -> Redirect away from auth pages
  if (session && isAuthPage) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 3. Role-based protection (server-side check)
  if (session) {
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
