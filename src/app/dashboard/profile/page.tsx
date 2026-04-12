"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Trophy, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  RefreshCw, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react"
import { useTheme } from "next-themes"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useOfflineSync } from "@/hooks/use-offline-sync"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { isSyncing, syncPendingResults } = useOfflineSync()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      }
      setLoading(false)
    }
    fetchUserData()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      <main className="container px-4 md:px-8 py-10 max-w-4xl mx-auto space-y-10">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
          
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.email}`} />
              <AvatarFallback className="bg-primary text-white text-4xl font-black">
                {userData?.fullName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-accent p-2 rounded-full border-4 border-white shadow-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2 flex-1 relative z-10">
            {loading ? (
              <>
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-6 w-64" />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{userData?.fullName || "Passer"}</h1>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-500 font-bold">
                  <Mail className="h-4 w-4" />
                  <span>{auth.currentUser?.email}</span>
                </div>
              </>
            )}
          </div>

          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="h-12 px-6 rounded-2xl border-4 border-slate-100 text-red-500 font-black hover:bg-red-50 hover:border-red-100 transition-all"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 text-center">
            <div className="bg-blue-50 p-3 rounded-2xl text-primary inline-block mb-4">
              <Trophy className="h-6 w-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Tests</p>
            <div className="text-3xl font-black text-slate-900">{userData?.stats?.testsTaken || 0}</div>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 text-center">
            <div className="bg-emerald-50 p-3 rounded-2xl text-accent inline-block mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
            <div className="text-3xl font-black text-slate-900">{userData?.stats?.avgScore || 0}%</div>
          </Card>

          <Card className="col-span-2 md:col-span-1 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 text-center">
            <div className="bg-purple-50 p-3 rounded-2xl text-purple-600 inline-block mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Study Hours</p>
            <div className="text-3xl font-black text-slate-900">42h</div>
          </Card>
        </section>

        {/* Settings List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight px-4">Account Settings</h2>
          
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden divide-y divide-slate-50">
            <div className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
              <div className="flex items-center space-x-6">
                <div className="bg-slate-100 p-4 rounded-2xl text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <Sun className="h-6 w-6 dark:hidden" />
                  <Moon className="h-6 w-6 hidden dark:block" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Dark Mode</p>
                  <p className="text-sm font-bold text-slate-400">Toggle app theme</p>
                </div>
              </div>
              <Switch 
                checked={theme === "dark"} 
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
              />
            </div>

            <div className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
              <div className="flex items-center space-x-6">
                <div className="bg-slate-100 p-4 rounded-2xl text-slate-500 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                  <RefreshCw className={`h-6 w-6 ${isSyncing ? "animate-spin" : ""}`} />
                </div>
                <div>
                  <p className="font-black text-slate-900">Cloud Sync</p>
                  <p className="text-sm font-bold text-slate-400">Manual synchronization</p>
                </div>
              </div>
              <Button 
                onClick={syncPendingResults}
                disabled={isSyncing}
                className="h-12 px-6 rounded-xl bg-accent hover:bg-accent/90 text-white font-black"
              >
                Sync Now
              </Button>
            </div>

            <div 
              onClick={() => router.push("/dashboard/performance")}
              className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-6">
                <div className="bg-slate-100 p-4 rounded-2xl text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Detailed Analytics</p>
                  <p className="text-sm font-bold text-slate-400">View performance charts</p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
