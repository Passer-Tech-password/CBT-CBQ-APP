"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from "recharts"
import { 
  TrendingUp, 
  Users, 
  Trophy, 
  Clock, 
  Calendar, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight,
  BookOpen,
  Target,
  FileText,
  Activity,
  Zap,
  Filter,
  MoreVertical
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import AdminLayout from "@/components/admin/admin-layout"
import { cn } from "@/lib/utils"

// Mock data for analytics
const PERFORMANCE_TREND = [
  { date: "Mar 01", avgScore: 65, tests: 45 },
  { date: "Mar 05", avgScore: 72, tests: 62 },
  { date: "Mar 10", avgScore: 68, tests: 58 },
  { date: "Mar 15", avgScore: 78, tests: 85 },
  { date: "Mar 20", avgScore: 75, tests: 72 },
  { date: "Mar 25", avgScore: 82, tests: 94 },
  { date: "Mar 30", avgScore: 85, tests: 110 },
]

const SUBJECT_PERFORMANCE = [
  { subject: "Mathematics", avgScore: 88, color: "#1E3A8A" },
  { subject: "Biology", avgScore: 75, color: "#10B981" },
  { subject: "Physics", avgScore: 62, color: "#8B5CF6" },
  { subject: "Chemistry", avgScore: 68, color: "#F59E0B" },
  { subject: "English", avgScore: 92, color: "#EC4899" },
]

const PASS_FAIL_DATA = [
  { name: "Pass (>=50%)", value: 780, color: "#10B981" },
  { name: "Fail (<50%)", value: 220, color: "#EF4444" },
]

const TOP_PERFORMERS = [
  { id: "1", name: "Alice Johnson", tests: 12, avgScore: 95, avatar: "Alice" },
  { id: "2", name: "Charlie Brown", tests: 15, avgScore: 92, avatar: "Charlie" },
  { id: "3", name: "Diana Prince", tests: 8, avgScore: 88, avatar: "Diana" },
]

const METRICS = [
  { label: "Total Tests Taken", value: "2,450", trend: "+12.5%", isPositive: true, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Most Active Subject", value: "Math", trend: "High", isPositive: true, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Completion Rate", value: "94.2%", trend: "+2.1%", isPositive: true, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Active Students", value: "1,120", trend: "-5.4%", isPositive: false, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => setIsExporting(false), 2000)
  }

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in duration-500 pb-10">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Analytics</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">In-depth insights into performance and platform usage.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-12 w-48 rounded-2xl border-2 border-slate-100 bg-white font-bold shadow-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                  <SelectValue placeholder="Time Range" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="h-12 px-6 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              <ArrowUpRight className="mr-2 h-5 w-5" />
              {isExporting ? "Exporting..." : "Export Report"}
            </Button>
          </div>
        </section>

        {/* Metric Cards */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 overflow-hidden relative group">
                <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 opacity-50", metric.bg)} />
                <div className="relative z-10">
                  <div className={cn("p-4 rounded-2xl inline-block mb-6 shadow-inner", metric.bg)}>
                    <metric.icon className={cn("h-7 w-7", metric.color)} />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{metric.label}</p>
                  <div className="flex items-end justify-between">
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">{metric.value}</div>
                    <div className={cn(
                      "flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      metric.isPositive ? "bg-emerald-50 text-accent border-emerald-100" : "bg-red-50 text-red-500 border-red-100"
                    )}>
                      {metric.isPositive ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                      {metric.trend}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
          {/* Main Trend Chart */}
          <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Performance Evolution</CardTitle>
                <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Daily average scores vs. test volume</CardDescription>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-100">
                <Button size="sm" variant="ghost" className="rounded-xl font-black text-xs h-9 bg-white shadow-sm text-primary">SCORES</Button>
                <Button size="sm" variant="ghost" className="rounded-xl font-black text-xs h-9 text-slate-400 hover:text-slate-600">VOLUME</Button>
              </div>
            </div>
            <div className="flex-1 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_TREND}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
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
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '1.5rem' }}
                    itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                    labelStyle={{ fontWeight: 900, marginBottom: '0.5rem', color: '#1e293b' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#1E3A8A" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    dot={{ r: 6, fill: '#1E3A8A', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 10 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pass/Fail Pie Chart */}
          <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10 flex flex-col">
            <div className="mb-10">
              <CardTitle className="text-2xl font-black text-slate-900">Pass/Fail Distribution</CardTitle>
              <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Overall test outcomes</CardDescription>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-[280px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PASS_FAIL_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {PASS_FAIL_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '1rem' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-4xl font-black text-slate-900">78%</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Pass Rate</div>
                </div>
              </div>
              <div className="w-full space-y-4 mt-8">
                {PASS_FAIL_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 shadow-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full mr-3 shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="font-black text-slate-600 text-sm uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Subject Performance Bar Chart */}
          <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Performance by Subject</CardTitle>
                <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Average scores across core subjects</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl border-2 border-slate-100">
                <MoreVertical className="h-6 w-6 text-slate-400" />
              </Button>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBJECT_PERFORMANCE} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="subject" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={120}
                    tick={{ fill: '#1e293b', fontSize: 14, fontWeight: 900 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', radius: 12 }}
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '1.2rem' }}
                  />
                  <Bar dataKey="avgScore" radius={[0, 15, 15, 0]} barSize={36}>
                    {SUBJECT_PERFORMANCE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Students Card */}
          <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10 flex flex-col">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Top Students</CardTitle>
                <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Highest average scores this month</CardDescription>
              </div>
              <div className="bg-emerald-50 text-accent p-3 rounded-2xl shadow-inner">
                <Trophy className="h-7 w-7" />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              {TOP_PERFORMERS.map((student, idx) => (
                <div key={student.id} className="flex items-center justify-between p-5 rounded-[2rem] bg-white border-2 border-slate-50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                  <div className="flex items-center space-x-5">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner transition-transform group-hover:rotate-6",
                      idx === 0 ? "bg-amber-100 text-amber-600" : idx === 1 ? "bg-slate-100 text-slate-500" : "bg-orange-100 text-orange-600"
                    )}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-lg">{student.name}</div>
                      <div className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-0.5">{student.tests} Tests Taken</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary">{student.avgScore}%</div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full h-14 rounded-2xl font-black text-slate-400 hover:text-primary hover:bg-primary/5 transition-all mt-4 border-2 border-dashed border-slate-200">
                View Full Leaderboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
