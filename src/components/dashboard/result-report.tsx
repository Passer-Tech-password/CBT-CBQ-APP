"use client"

import { CheckCircle2, XCircle, Clock, GraduationCap, Target } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface Question {
  id: number
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation: string
}

interface ResultData {
  studentName: string
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeTaken: string
  accuracy: number
  date: string
  questions: Question[]
}

interface ResultReportProps {
  data: ResultData
  subject: string
  id?: string
}

export function ResultReport({ data, subject, id = "pdf-report-content" }: ResultReportProps) {
  const chartData = [
    { name: "Correct", value: data.correctAnswers, color: "#10B981" },
    { name: "Incorrect", value: data.incorrectAnswers, color: "#EF4444" }
  ]

  return (
    <div id={id} className="w-[1000px] bg-white p-16 text-slate-900 font-sans border border-slate-100 shadow-sm overflow-hidden">
      {/* PDF Header - Professional Branding */}
      <div className="flex items-center justify-between border-b-[6px] border-[#10B981] pb-10 mb-12">
        <div className="flex items-center space-x-6">
          <div className="bg-[#1E3A8A] p-4 rounded-[1.5rem] shadow-2xl">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tighter uppercase">CBT & CBQ</h1>
            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Excellence Examination Platform</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Examination Date</div>
          <div className="text-xl font-black text-slate-900">{data.date}</div>
          <div className="text-[10px] font-black text-[#10B981] uppercase tracking-widest mt-1">Official Certified Report</div>
        </div>
      </div>

      {/* Main Stats Area: Student Info + Score + Pie Chart */}
      <div className="grid grid-cols-12 gap-10 mb-16">
        <div className="col-span-5 space-y-8 flex flex-col justify-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Candididate Full Name</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{data.studentName}</h2>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Subject Category</p>
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-[#10B981]" />
              <h3 className="text-2xl font-black text-[#1E3A8A] uppercase tracking-tight">{subject}</h3>
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-slate-50 rounded-[3rem] p-10 flex flex-col items-center justify-center border-2 border-slate-100 shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-full -mr-16 -mt-16" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 relative z-10">Total Performance</p>
          <div className="text-8xl font-black text-[#1E3A8A] tracking-tighter relative z-10">{data.score}%</div>
          <div className={cn(
            "mt-6 px-8 py-2.5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-lg relative z-10",
            data.score >= 50 ? "bg-[#10B981] text-white" : "bg-red-500 text-white"
          )}>
            {data.score >= 50 ? "Pass" : "Fail"} Status
          </div>
        </div>

        <div className="col-span-3 flex flex-col items-center justify-center space-y-4">
          <div className="h-[180px] w-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 leading-none">{data.accuracy}%</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Accuracy</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-[#10B981]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Correct</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incorrect</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row - High Impact Stats */}
      <div className="grid grid-cols-3 gap-8 mb-16">
        {[
          { label: "Correct Answers", value: `${data.correctAnswers} / ${data.totalQuestions}`, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", borderColor: "border-emerald-100" },
          { label: "Incorrect Count", value: data.incorrectAnswers, icon: XCircle, color: "text-red-500", bg: "bg-red-50", borderColor: "border-red-100" },
          { label: "Completion Time", value: data.timeTaken, icon: Clock, color: "text-blue-500", bg: "bg-blue-50", borderColor: "border-blue-100" },
        ].map((stat) => (
          <div key={stat.label} className={cn("p-8 rounded-[2.5rem] bg-white border-2 shadow-sm flex items-center space-x-5", stat.borderColor)}>
            <div className={cn("p-4 rounded-2xl", stat.bg)}>
              <stat.icon className={cn("h-8 w-8", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Question Breakdown - Professional Table-like Layout */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-6 mb-8">
          <h4 className="text-2xl font-black text-slate-900 uppercase tracking-[0.2em]">Detailed Analysis</h4>
          <div className="bg-[#1E3A8A]/5 px-6 py-2 rounded-xl text-[#1E3A8A] font-black text-xs uppercase tracking-widest">
            {data.totalQuestions} Questions Evaluated
          </div>
        </div>

        {data.questions.map((q, idx) => (
          <div key={idx} className="p-10 rounded-[3rem] bg-slate-50/50 border-2 border-slate-50 break-inside-avoid relative overflow-hidden">
            {/* Index Badge */}
            <div className="absolute top-0 left-0 bg-[#1E3A8A] text-white px-6 py-2 rounded-br-[2rem] font-black text-sm shadow-lg">
              Q{idx + 1}
            </div>

            <div className="mt-4 flex items-start justify-between mb-8">
              <div className="flex-1 pr-10">
                <p className="text-xl font-bold text-slate-900 leading-snug">{q.question}</p>
              </div>
              <div className={cn(
                "px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-md shrink-0",
                q.isCorrect ? "bg-[#10B981] text-white" : "bg-red-500 text-white"
              )}>
                {q.isCorrect ? "Correct" : "Incorrect"}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-5 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5">Candidate Response</p>
                  <div className={cn(
                    "font-black text-xl px-6 py-3 rounded-2xl border-2",
                    q.isCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"
                  )}>{q.userAnswer}</div>
                </div>
                {!q.isCorrect && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5">Correct Answer</p>
                    <div className="font-black text-xl px-6 py-3 rounded-2xl border-2 bg-emerald-50 border-emerald-100 text-emerald-600 inline-block min-w-[150px]">
                      {q.correctAnswer}
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="col-span-7 bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
                <div className="flex items-center space-x-3 text-[#1E3A8A] font-black text-xs uppercase tracking-widest mb-4">
                  <GraduationCap className="h-5 w-5" />
                  <span>Educational Insight</span>
                </div>
                <p className="text-slate-600 font-bold text-base leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Footer - Certification & Authenticity */}
      <div className="mt-24 pt-10 border-t-4 border-slate-100 text-center">
        <div className="flex items-center justify-center space-x-12 mb-8">
          <div className="text-left">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated by</div>
            <div className="text-sm font-black text-[#1E3A8A]">CBT Excellence Board</div>
          </div>
          <div className="h-16 w-[1px] bg-slate-100" />
          <div className="text-left">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Verification ID</div>
            <div className="text-sm font-black text-slate-900 font-mono">CBT-{Math.random().toString(36).substring(2, 12).toUpperCase()}</div>
          </div>
        </div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] max-w-2xl mx-auto">
          This document is an official electronic transcript. Any alteration to this document invalidates the results.
        </p>
      </div>
    </div>
  )
}
