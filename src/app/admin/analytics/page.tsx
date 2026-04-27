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
import { useToast } from "@/components/ui/use-toast"
import { exportToPDF } from "@/lib/pdf-export"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore"

// Constants for UI
const METRIC_CONFIG = [
  { label: "Total Tests Taken", key: "totalTests", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Most Active Subject", key: "activeSubject", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Average Pass Rate", key: "passRateDisplay", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Active Students", key: "activeStudents", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [isExporting, setIsExporting] = useState(false)
  const [liveResults, setLiveResults] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any>({
    totalTests: "0",
    activeSubject: "N/A",
    passRateDisplay: "0%",
    activeStudents: "0",
    passRate: 0
  })
  const [topPerformers, setTopPerformers] = useState<any[]>([])
  const [performanceTrend, setPerformanceTrend] = useState<any[]>([])
  const [passFailData, setPassFailData] = useState<any[]>([
    { name: "Pass (>=50%)", value: 0, color: "#10B981" },
    { name: "Fail (<50%)", value: 0, color: "#EF4444" },
  ])
  const { toast } = useToast()

  useEffect(() => {
    // 1. Live Scoreboard Listener
    const qLive = query(
      collection(db, "results"),
      orderBy("completedAt", "desc"),
      limit(10)
    )

    const unsubscribeLive = onSnapshot(qLive, (snapshot) => {
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setLiveResults(results)
    })

    // 2. Fetch all results for aggregate metrics
    const fetchMetrics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "results"))
        const allResults = querySnapshot.docs.map(doc => doc.data())
        
        if (allResults.length === 0) return

        // Calculate Metrics
        const totalTests = allResults.length
        const students = new Set(allResults.map(r => r.uid)).size
        
        const subjectCounts: Record<string, number> = {}
        let passes = 0
        let fails = 0

        // Performance Trend calculation (last 7 days)
        const dailyStats: Record<string, { total: number, count: number }> = {}
        const now = new Date()
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(d.getDate() - i)
          dailyStats[d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })] = { total: 0, count: 0 }
        }

        allResults.forEach(r => {
          // Subject activity
          subjectCounts[r.subject] = (subjectCounts[r.subject] || 0) + 1
          
          // Pass/Fail
          if (r.score >= 50) passes++
          else fails++

          // Daily stats
          const dateStr = new Date(r.completedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
          if (dailyStats[dateStr]) {
            dailyStats[dateStr].total += r.score
            dailyStats[dateStr].count += 1
          }
        })

        const activeSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
        const passRate = totalTests > 0 ? Math.round((passes / totalTests) * 100) : 0
        
        setMetrics({
          totalTests: totalTests.toLocaleString(),
          activeSubject,
          passRateDisplay: `${passRate}%`,
          activeStudents: students.toLocaleString(),
          passRate
        })

        setPassFailData([
          { name: "Pass (>=50%)", value: passes, color: "#10B981" },
          { name: "Fail (<50%)", value: fails, color: "#EF4444" },
        ])

        setPerformanceTrend(Object.entries(dailyStats).map(([date, stats]) => ({
          date,
          avgScore: stats.count > 0 ? Math.round(stats.total / stats.count) : 0
        })))

        // Calculate Top Performers
        const studentStats: Record<string, { name: string, tests: number, totalScore: number }> = {}
        allResults.forEach(r => {
          if (!studentStats[r.uid]) {
            studentStats[r.uid] = { name: r.studentName || "Anonymous", tests: 0, totalScore: 0 }
          }
          studentStats[r.uid].tests += 1
          studentStats[r.uid].totalScore += r.score
        })

        const performers = Object.entries(studentStats)
          .map(([id, stats]) => ({
            id,
            name: stats.name,
            tests: stats.tests,
            avgScore: Math.round(stats.totalScore / stats.tests),
            avatar: stats.name
          }))
          .sort((a, b) => b.avgScore - a.avgScore)
          .slice(0, 5)

        setTopPerformers(performers)
      } catch (error) {
        console.error("Error fetching metrics:", error)
      }
    }

    fetchMetrics()

    return () => unsubscribeLive()
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    toast({
      title: "Generating Analytics Report",
      description: "Please wait while we compile the system performance data...",
    })
    
    const success = await exportToPDF("admin-analytics-content", `CBT-System-Analytics-${new Date().toISOString().split('T')[0]}.pdf`)
    
    setIsExporting(false)
    if (success) {
      toast({
        title: "Export Successful",
        description: "The system analytics report has been downloaded.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error generating the PDF. Please try again.",
      })
    }
  }

  return (
    <div id="admin-analytics-content" className="space-y-10 animate-in fade-in duration-500 pb-10">
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
          {METRIC_CONFIG.map((metric, idx) => (
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
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">{metrics[metric.key]}</div>
                    <div className={cn(
                      "flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      "bg-emerald-50 text-accent border-emerald-100"
                    )}>
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      Live
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
                <AreaChart data={performanceTrend}>
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
                      data={passFailData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {passFailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '1rem' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-4xl font-black text-slate-900">{metrics.passRate}%</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Pass Rate</div>
                </div>
              </div>
              <div className="w-full space-y-4 mt-8">
                {passFailData.map((item) => (
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

          {/* Live Scoreboard */}
          <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900">Live Scoreboard</CardTitle>
                <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Real-time test submissions.</CardDescription>
              </div>
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left pb-4 font-black text-slate-400 uppercase tracking-widest text-xs">Student</th>
                    <th className="text-left pb-4 font-black text-slate-400 uppercase tracking-widest text-xs">Subject</th>
                    <th className="text-center pb-4 font-black text-slate-400 uppercase tracking-widest text-xs">Score</th>
                    <th className="text-right pb-4 font-black text-slate-400 uppercase tracking-widest text-xs">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {liveResults.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-bold">No recent results found.</td>
                    </tr>
                  ) : (
                    liveResults.map((result) => (
                      <tr key={result.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-xs">
                              {result.studentName?.charAt(0) || "S"}
                            </div>
                            <span className="font-bold text-slate-900">{result.studentName || "Anonymous"}</span>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-slate-500">{result.subject}</td>
                        <td className="py-4 text-center">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-black",
                            result.score >= 70 ? "bg-emerald-100 text-emerald-600" :
                            result.score >= 50 ? "bg-amber-100 text-amber-600" :
                            "bg-rose-100 text-rose-600"
                          )}>
                            {Math.round(result.score)}%
                          </span>
                        </td>
                        <td className="py-4 text-right text-slate-400 font-bold text-xs">
                          {result.completedAt ? new Date(result.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
              {topPerformers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-bold">No performance data yet.</div>
              ) : (
                topPerformers.map((student, idx) => (
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
                ))
              )}
              <Button variant="ghost" className="w-full h-14 rounded-2xl font-black text-slate-400 hover:text-primary hover:bg-primary/5 transition-all mt-4 border-2 border-dashed border-slate-200">
                View Full Leaderboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
  )
}
