"use client"

import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { GraduationCap, LogOut, User, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export function DashboardNavbar() {
  const router = useRouter()
  const user = auth.currentUser

  const handleSignOut = async () => {
    await signOut(auth)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-white shadow-lg">
      <div className="container flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 font-black text-2xl tracking-tighter">
            <div className="bg-white p-1.5 rounded-xl shadow-inner">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <span className="hidden sm:inline-block">CBT & CBQ</span>
          </div>
          <div className="hidden lg:flex relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
            <Input 
              placeholder="Search subjects, tests..." 
              className="pl-10 w-[300px] h-10 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/20 transition-all rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="hidden md:flex flex-col items-end text-right">
            <p className="text-sm font-bold leading-none">Good morning, {user?.displayName?.split(' ')[0] || "Passer"} 👋</p>
            <p className="text-[10px] font-medium text-white/60 uppercase tracking-widest mt-1">Student Account</p>
          </div>

          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 h-11 w-11 rounded-xl">
            <Bell className="h-6 w-6" />
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-primary"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-2xl p-0 hover:bg-white/10 transition-all active:scale-95">
                <Avatar className="h-12 w-12 border-2 border-white/20 shadow-xl">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt={user?.displayName || "User"} />
                  <AvatarFallback className="bg-white text-primary font-black">
                    {user?.displayName?.[0] || user?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || "Student"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
