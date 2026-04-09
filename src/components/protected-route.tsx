"use client"

import { useAuth } from "./auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { LoadingScreen } from "./ui/loading-screen"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "student" | "admin"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userData, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (requiredRole === "admin" && !isAdmin) {
        router.push("/dashboard")
        return
      }

      if (requiredRole === "student" && isAdmin) {
        router.push("/admin")
        return
      }
    }
  }, [user, userData, loading, isAdmin, router, requiredRole])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  if (requiredRole === "admin" && !isAdmin) {
    return null
  }

  if (requiredRole === "student" && isAdmin) {
    return null
  }

  return <>{children}</>
}
