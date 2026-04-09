"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { Button } from "@/components/ui/button"
import { Sparkles, Trophy, Calendar, User } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-8">
        <DashboardNavbar />
        {children}

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t px-6 py-3 flex items-center justify-between z-50">
          <Button variant="ghost" size="icon" className="text-primary flex flex-col items-center h-auto py-1">
            <div className="p-2 rounded-xl bg-primary/10 mb-1">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 flex flex-col items-center h-auto py-1">
            <div className="p-2 mb-1">
              <Trophy className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold">Quiz</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 flex flex-col items-center h-auto py-1">
            <div className="p-2 mb-1">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold">Exam</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 flex flex-col items-center h-auto py-1">
            <div className="p-2 mb-1">
              <User className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold">Profile</span>
          </Button>
        </nav>
      </div>
    </ProtectedRoute>
  )
}
