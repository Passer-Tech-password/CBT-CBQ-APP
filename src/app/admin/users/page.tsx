"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  UserCog, 
  Trash2, 
  Eye, 
  Shield, 
  GraduationCap,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Mock user data
const MOCK_USERS = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Student", testsTaken: 12, avgScore: 85, joinedDate: "2024-03-15", avatar: "Alice" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Student", testsTaken: 8, avgScore: 72, joinedDate: "2024-03-20", avatar: "Bob" },
  { id: "3", name: "Admin User", email: "admin@cbt.com", role: "Admin", testsTaken: 0, avgScore: 0, joinedDate: "2024-01-10", avatar: "Admin" },
  { id: "4", name: "Charlie Brown", email: "charlie@example.com", role: "Student", testsTaken: 15, avgScore: 92, joinedDate: "2024-02-05", avatar: "Charlie" },
  { id: "5", name: "Diana Prince", email: "diana@example.com", role: "Student", testsTaken: 5, avgScore: 88, joinedDate: "2024-03-25", avatar: "Diana" },
  { id: "6", name: "Edward Norton", email: "edward@example.com", role: "Student", testsTaken: 20, avgScore: 79, joinedDate: "2024-01-20", avatar: "Edward" },
  { id: "7", name: "Fiona Apple", email: "fiona@example.com", role: "Student", testsTaken: 3, avgScore: 95, joinedDate: "2024-04-01", avatar: "Fiona" },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "All" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
    setIsDeleting(null)
    toast({
      title: "User Deleted",
      description: "The user has been successfully removed from the system.",
      variant: "destructive"
    })
  }

  const handleChangeRole = (id: string, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
    toast({
      title: "Role Updated",
      description: `User role has been changed to ${newRole}.`,
    })
  }

  return (
    <div className="users-management-container">
      <div className="space-y-10 animate-in fade-in duration-500">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">Oversee all registered students and administrators.</p>
          </div>
          <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-95">
            <UserPlus className="mr-2 h-6 w-6" />
            Add New User
          </Button>
        </section>

        {/* Filters & Search */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Search by name or email..." 
                  className="pl-12 h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold focus:bg-white transition-all text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-lg">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-slate-400" />
                      <SelectValue placeholder="Filter by Role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="Student">Students</SelectItem>
                    <SelectItem value="Admin">Administrators</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-b-2 border-slate-100">
                    <TableHead className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">User</TableHead>
                    <TableHead className="py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Role</TableHead>
                    <TableHead className="py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Tests Taken</TableHead>
                    <TableHead className="py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Avg Score</TableHead>
                    <TableHead className="py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Joined Date</TableHead>
                    <TableHead className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user) => (
                      <motion.tr
                        layout
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} />
                              <AvatarFallback className="bg-primary text-white font-black">{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-black text-slate-900 text-lg leading-tight">{user.name}</div>
                              <div className="text-slate-400 font-bold text-sm flex items-center mt-1">
                                <Mail className="h-3 w-3 mr-1.5" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <Badge className={cn(
                            "px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-2 shadow-sm",
                            user.role === "Admin" 
                              ? "bg-primary/5 text-primary border-primary/10" 
                              : "bg-accent/5 text-accent border-accent/10"
                          )}>
                            {user.role === "Admin" && <Shield className="mr-1.5 h-3 w-3" />}
                            {user.role === "Student" && <GraduationCap className="mr-1.5 h-3.5 w-3.5" />}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <div className="font-black text-slate-700 text-lg">{user.testsTaken}</div>
                        </TableCell>
                        <TableCell className="py-6 text-center">
                          <div className={cn(
                            "inline-flex items-center justify-center h-10 w-16 rounded-xl font-black text-lg",
                            user.avgScore >= 80 ? "bg-emerald-50 text-accent" : 
                            user.avgScore >= 50 ? "bg-blue-50 text-primary" : "bg-red-50 text-red-500"
                          )}>
                            {user.avgScore}%
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="text-slate-500 font-bold flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-slate-300" />
                            {user.joinedDate}
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100 transition-colors">
                                <MoreHorizontal className="h-6 w-6 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-none shadow-2xl">
                              <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-slate-400 px-4 py-3">User Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="rounded-xl font-bold py-3 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">
                                <Eye className="mr-3 h-5 w-5" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleChangeRole(user.id, user.role === "Admin" ? "Student" : "Admin")}
                                className="rounded-xl font-bold py-3 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                              >
                                <UserCog className="mr-3 h-5 w-5" /> 
                                {user.role === "Admin" ? "Make Student" : "Make Admin"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-2 bg-slate-100" />
                              <DropdownMenuItem 
                                onClick={() => setIsDeleting(user.id)}
                                className="rounded-xl font-bold py-3 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 transition-colors"
                              >
                                <Trash2 className="mr-3 h-5 w-5" /> Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Pagination Placeholder */}
            <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
              <p className="text-sm font-bold text-slate-400">
                Showing <span className="text-slate-900">{filteredUsers.length}</span> users
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2 border-slate-100 hover:bg-white transition-all disabled:opacity-30" disabled>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 flex items-center justify-center font-black bg-primary text-white rounded-xl shadow-lg shadow-primary/20">1</div>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2 border-slate-100 hover:bg-white transition-all">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
        <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl max-w-md">
          <DialogHeader className="mb-6">
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Trash2 className="h-10 w-10" />
            </div>
            <DialogTitle className="text-3xl font-black text-slate-900 text-center">Are you sure?</DialogTitle>
            <DialogDescription className="text-lg font-bold text-slate-400 text-center">
              This action cannot be undone. All data associated with this user will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Button 
              onClick={() => isDeleting && handleDeleteUser(isDeleting)}
              className="h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-lg shadow-xl shadow-red-200 transition-all active:scale-95"
            >
              Yes, Delete User
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="h-14 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
