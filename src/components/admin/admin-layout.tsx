"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Trophy, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  GraduationCap,
  ChevronRight,
  LogOut,
  Search,
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { auth, db } from "@/lib/firebase"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Questions", icon: BookOpen, path: "/admin/questions" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Quiz Builder", icon: BookOpen, path: "/admin/builder" },
  { name: "Competitions", icon: Trophy, path: "/admin/competitions" },
  { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCheckingRole, setIsCheckingRole] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true)
          } else {
            router.push("/dashboard")
          }
        } catch (error) {
          console.error("Error checking admin role:", error)
          router.push("/dashboard")
        }
      } else {
        router.push("/login")
      }
      setIsCheckingRole(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await signOut(auth)
    router.push("/login")
  }

  if (isCheckingRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-black text-slate-600">Verifying Admin Access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-primary text-white transition-all duration-300 ease-in-out z-50",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="bg-white p-2 rounded-xl shadow-lg transition-transform group-hover:rotate-6">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            {isSidebarOpen && (
              <span className="font-black text-xl tracking-tighter whitespace-nowrap">
                CBT Admin
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={cn(
                  "flex items-center space-x-4 px-4 py-3.5 rounded-2xl font-bold transition-all group relative",
                  isActive 
                    ? "bg-white text-primary shadow-xl shadow-black/10" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-white/60 group-hover:text-white")} />
                {isSidebarOpen && (
                  <span className="whitespace-nowrap flex-1">{item.name}</span>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div layoutId="active-pill" className="absolute right-4">
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl font-bold text-white/60 hover:text-white hover:bg-red-500/20 transition-all",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Menu - Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-primary text-white z-[70] md:hidden flex flex-col"
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-xl shadow-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <span className="font-black text-xl tracking-tighter">CBT Admin</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:bg-white/10">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path
                return (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-4 px-4 py-4 rounded-2xl font-bold transition-all",
                      isActive 
                        ? "bg-white text-primary shadow-xl" 
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-10 shrink-0 z-40 shadow-sm">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-slate-500"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex text-slate-400 hover:text-primary transition-colors"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden lg:flex relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search everything..." 
                className="pl-10 w-[300px] h-10 border-slate-100 bg-slate-50 focus:bg-white transition-all rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-primary transition-colors h-10 w-10 rounded-xl">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </Button>

            <div className="h-10 w-px bg-slate-200" />

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <p className="text-sm font-black text-slate-900 leading-none">Admin User</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Super Admin</p>
              </div>
              <Avatar className="h-11 w-11 border-2 border-slate-100 shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=admin`} />
                <AvatarFallback className="bg-primary text-white font-black">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
