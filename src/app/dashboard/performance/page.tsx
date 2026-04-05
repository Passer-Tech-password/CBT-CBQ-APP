"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts"
import { 
  TrendingUp, 
  Target, 
  Trophy, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  BookOpen,
  CheckCircle2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { PerformanceSkeleton } from "@/components/dashboard/performance-skeleton"
import { cn } from "@/lib/utils"

// Mock analytics data
const TREND_DATA = [
  { date: "Mar 1", score: 72 },
  { date: "Mar 5", score: 85 },
  { date: "Mar 10", score: 78 },
  { date: "Mar 15", score: 92 },
  { date: "Mar 20", score: 88 },
  { date: "Mar 25", score: 95 }
]

const SUBJECT_PERFORMANCE = [
  { subject: "Mathematics", score: 92, color: "#1E3A8A" },
  { subject: "Biology", score: 85, color: "#10B981" },
  { subject: "English", score: 78, color: "#8B5CF6" },
  { subject: "Physics", score: 65, color: "#F59E0B" }
]

const STRENGTHS = ["Algebra", "Genetics", "Grammar", "Optics"]
const WEAKNESSES = ["Calculus", "Organic Chemistry", "World History"]

export default function PerformancePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PerformanceSkeleton />
  }
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <DashboardNavbar />
      
      <main className="container px-4 md:px-8 py-10 max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center space-x-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>Performance Analytics</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Your Learning Journey
            </h1>
            <p className="text-slate-500 text-lg font-medium mt-2">
              Detailed insights into your progress and subject mastery.
            </p>
          </motion.div>

          <Button className="h-14 px-8 rounded-2xl bg-white text-primary border-4 border-slate-100 font-black shadow-xl hover:bg-slate-50">
            Export Report
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

        {/* Global Stats Overview */}
        <section className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Overall Score", value: "84%", icon: Target, color: "text-primary", bg: "bg-blue-50" },
            { label: "Global Rank", value: "#124", icon: Trophy, color: "text-accent", bg: "bg-emerald-50" },
            { label: "Study Time", value: "48h", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Mastery Level", value: "Gold", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50" }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] p-8">
                <div className={cn("p-3 rounded-2xl inline-block mb-4", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="grid lg:grid-cols-2 gap-10">
          {/* Score Trend Line Chart */}
          <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-2xl font-black text-slate-900">Score Trend</CardTitle>
              <CardDescription className="text-slate-500 font-bold">Your performance over the last 30 days</CardDescription>
            </CardHeader>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '1rem' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#1E3A8A" 
                    strokeWidth={5} 
                    dot={{ r: 6, fill: '#1E3A8A', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 10 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Performance by Subject Bar Chart */}
          <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-2xl font-black text-slate-900">Subject Mastery</CardTitle>
              <CardDescription className="text-slate-500 font-bold">Average score by category</CardDescription>
            </CardHeader>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBJECT_PERFORMANCE} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="subject" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={100}
                    tick={{ fill: '#1e293b', fontSize: 14, fontWeight: 800 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={32}>
                    {SUBJECT_PERFORMANCE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* Strengths and Weaknesses */}
        <section className="grid md:grid-cols-2 gap-10">
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-emerald-50 p-4 rounded-2xl text-accent shadow-inner">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Top Strengths</h3>
                <p className="text-sm font-bold text-slate-500">You're excelling in these areas</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {STRENGTHS.map((s) => (
                <div key={s} className="px-6 py-3 rounded-2xl bg-emerald-50 border-2 border-emerald-100 text-accent font-black text-sm flex items-center shadow-sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {s}
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-red-50 p-4 rounded-2xl text-red-500 shadow-inner">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Focus Areas</h3>
                <p className="text-sm font-bold text-slate-500">Recommended for more practice</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {WEAKNESSES.map((w) => (
                <div key={w} className="px-6 py-3 rounded-2xl bg-red-50 border-2 border-red-100 text-red-500 font-black text-sm flex items-center shadow-sm">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  {w}
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  )
}
