"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { Button } from "@/components/ui/button"
import { Sparkles, Trophy, Calendar, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { name: "Home", icon: Sparkles, path: "/dashboard" },
    { name: "Quiz", icon: Trophy, path: "/dashboard/quiz" },
    { name: "Exam", icon: Calendar, path: "/dashboard/mode-selection" },
    { name: "Profile", icon: User, path: "/dashboard/profile" },
  ]

  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-8">
        <DashboardNavbar />
        {children}

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t px-6 py-3 flex items-center justify-between z-50">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Button 
                key={item.name}
                variant="ghost" 
                size="icon" 
                onClick={() => router.push(item.path)}
                className={cn(
                  "flex flex-col items-center h-auto py-1 transition-all",
                  isActive ? "text-primary" : "text-slate-400"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl mb-1 transition-colors",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold">{item.name}</span>
              </Button>
            )
          })}
        </nav>
      </div>
    </ProtectedRoute>
  )
}
