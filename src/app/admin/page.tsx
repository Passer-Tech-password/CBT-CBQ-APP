"use client"

import { motion } from "framer-motion"
import { 
  Users, 
  Trophy, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  ChevronRight
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Mock data for Admin Dashboard
const TREND_DATA = [
  { date: "Mar 1", score: 72 },
  { date: "Mar 5", score: 85 },
  { date: "Mar 10", score: 78 },
  { date: "Mar 15", score: 92 },
  { date: "Mar 20", score: 88 },
  { date: "Mar 25", score: 95 }
]

const RECENT_RESULTS = [
  { id: 1, student: "Alice Johnson", subject: "Mathematics", score: 92, status: "excellent", avatar: "Alice" },
  { id: 2, student: "Bob Smith", subject: "Biology", score: 85, status: "good", avatar: "Bob" },
  { id: 3, student: "Charlie Brown", subject: "Physics", score: 65, status: "average", avatar: "Charlie" },
  { id: 4, student: "Diana Prince", score: 78, subject: "English", status: "good", avatar: "Diana" },
  { id: 5, student: "Edward Norton", score: 95, subject: "Chemistry", status: "excellent", avatar: "Edward" }
]

const STATS_CARDS = [
  { label: "Total Students", value: "2,450", icon: Users, trend: "+12.5%", isPositive: true, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Active Competitions", value: "18", icon: Trophy, trend: "+3", isPositive: true, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Average Score", value: "78%", icon: Target, trend: "-2.1%", isPositive: false, color: "text-accent", bg: "bg-emerald-50" },
  { label: "Completion Rate", value: "94.2%", icon: CheckCircle2, trend: "+4.2%", isPositive: true, color: "text-amber-600", bg: "bg-amber-50" }
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">
      {/* Welcome & Overview Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-bold mt-1 text-lg">Real-time performance metrics and student activity.</p>
        </motion.div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-4 border-slate-100 font-black shadow-xl hover:bg-slate-50">
            Download CSV
          </Button>
          <Button className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20">
            Generate Report
          </Button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {STATS_CARDS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 overflow-hidden relative group">
              <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110", stat.bg)} />
              <div className="relative z-10">
                <div className={cn("p-4 rounded-2xl inline-block mb-6 shadow-inner", stat.bg)}>
                  <stat.icon className={cn("h-7 w-7", stat.color)} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                  <div className={cn(
                    "flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    stat.isPositive ? "bg-emerald-50 text-accent" : "bg-red-50 text-red-500"
                  )}>
                    {stat.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {stat.trend}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Charts & Table Section */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8">
          <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-slate-900">Platform Growth</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Monthly student engagement analysis</CardDescription>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              <Button variant="ghost" size="sm" className="rounded-lg h-8 px-4 font-black text-[10px] uppercase bg-white shadow-sm">Engagement</Button>
              <Button variant="ghost" size="sm" className="rounded-lg h-8 px-4 font-black text-[10px] uppercase text-slate-400">Activity</Button>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '1.5rem', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '1rem'
                  }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 900 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 overflow-hidden flex flex-col">
          <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-slate-900">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Live performance feed</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0 flex-1 space-y-6">
            {RECENT_RESULTS.map((result) => (
              <div key={result.id} className="flex items-center justify-between group cursor-pointer p-2 -m-2 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-4 border-white shadow-xl">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${result.avatar}`} />
                      <AvatarFallback className="font-black bg-slate-100">{result.student[0]}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center",
                      result.status === "excellent" ? "bg-emerald-500" : "bg-blue-500"
                    )}>
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{result.student}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{result.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">{result.score}%</div>
                  <div className="flex items-center justify-end text-[8px] font-black uppercase tracking-tighter text-slate-400">
                    <TrendingUp className="h-2 w-2 mr-1 text-emerald-500" />
                    Increased
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="pt-8 mt-auto border-t border-slate-50">
            <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-900/10 group">
              View All Activities
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
