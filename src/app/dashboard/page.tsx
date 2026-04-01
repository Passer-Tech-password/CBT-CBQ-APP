"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { Loader2, Sparkles, Trophy, Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { DashboardNavbar } from "@/components/dashboard/navbar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { SubjectGrid } from "@/components/dashboard/subject-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
        setIsLoading(false)
      } else {
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-slate-600">Preparing your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-8">
      <DashboardNavbar />
      
      <main className="container px-4 md:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 text-primary font-semibold mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wider">Student Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {getTimeGreeting()}, {userData?.fullName?.split(' ')[0] || "Passer"} 👋
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              You're doing great! Ready to challenge yourself today?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="flex flex-col items-end text-right">
              <span className="text-sm font-bold text-slate-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Academic Year 2026/2027</span>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <StatsCards stats={userData?.stats} />

        {/* Quick Action & Competition Banner */}
        <section className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card className="bg-primary text-white border-none overflow-hidden relative min-h-[220px] flex items-center">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 skew-x-12 translate-x-12" />
              <div className="absolute bottom-0 right-12 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              
              <CardContent className="p-8 relative z-10 w-full md:w-2/3">
                <div className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4">
                  Live Competition
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  Join the National CBQ <br />Mathematics Challenge
                </CardTitle>
                <CardDescription className="text-blue-100 text-base mb-6 font-medium">
                  Compete with students across the country in real-time. Starts in 2 hours!
                </CardDescription>
                <Button className="bg-white text-primary hover:bg-blue-50 font-bold px-8 h-11 rounded-xl transition-all hover:scale-105 group">
                  Register Now
                  <Trophy className="ml-2 h-4 w-4 text-accent transition-transform group-hover:rotate-12" />
                </Button>
              </CardContent>
              
              <div className="hidden md:flex absolute right-12 bottom-4 top-4 w-1/3 items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/30 rounded-full blur-2xl animate-pulse" />
                  <Trophy className="h-40 w-40 text-white/90 drop-shadow-2xl" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full border-none shadow-md shadow-slate-200/50 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Recent Activity</CardTitle>
                <CardDescription>Your last 3 attempts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: "Mathematics", score: 85, date: "2h ago", type: "Practice" },
                  { subject: "English", score: 92, date: "Yesterday", type: "Timed Exam" },
                  { subject: "Science", score: 78, date: "2 days ago", type: "Practice" }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{activity.subject}</p>
                        <p className="text-xs text-slate-500">{activity.type} • {activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">{activity.score}%</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Subjects Grid */}
        <SubjectGrid />
      </main>

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
            <Calendar className="h-6 w-6" />
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
  )
}
