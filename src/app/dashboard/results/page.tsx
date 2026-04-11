"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Trophy, 
  Clock, 
  Target, 
  ArrowLeft, 
  Share2, 
  Download, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  GraduationCap,
  ChevronRight,
  PartyPopper
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import confetti from 'canvas-confetti'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { cn } from "@/lib/utils"
import { exportToPDF } from "@/lib/pdf-export"
import { ResultReport } from "@/components/dashboard/result-report"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"

// Mock results data for development
const MOCK_RESULTS = {
  studentName: "Alice Johnson",
  score: 92,
  totalQuestions: 20,
  correctAnswers: 18,
  incorrectAnswers: 2,
  timeTaken: "12:45",
  accuracy: 90,
  date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
  questions: [
    {
      id: 1,
      question: "What is the result of 15 x 8?",
      userAnswer: "120",
      correctAnswer: "120",
      isCorrect: true,
      explanation: "15 multiplied by 8 equals 120."
    },
    {
      id: 2,
      question: "Solve for x: 2x + 10 = 30",
      userAnswer: "10",
      correctAnswer: "10",
      isCorrect: true,
      explanation: "Subtract 10 from both sides: 2x = 20. Divide by 2: x = 10."
    },
    {
      id: 3,
      question: "What is the square root of 144?",
      userAnswer: "14",
      correctAnswer: "12",
      isCorrect: false,
      explanation: "12 x 12 = 144. The user selected 14, but 14 x 14 = 196."
    }
  ]
}

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resultId = searchParams.get("id")
  const subjectParam = searchParams.get("subject")
  
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchResult() {
      if (!resultId) {
        setResult(MOCK_RESULTS)
        setIsLoading(false)
        return
      }

      try {
        const docRef = doc(db, "results", resultId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setResult(docSnap.data())
        } else {
          toast({
            variant: "destructive",
            title: "Result Not Found",
            description: "We couldn't find the requested result details.",
          })
          setResult(MOCK_RESULTS)
        }
      } catch (error) {
        console.error("Error fetching result:", error)
        setResult(MOCK_RESULTS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResult()
  }, [resultId, toast])

  useEffect(() => {
    if (result && result.score >= 90) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#10B981']
      })
    }
  }, [result])

  const subject = subjectParam || result?.subject || "Examination"

  const chartData = result ? [
    { name: "Correct", value: result.correctAnswers, color: "#10B981" },
    { name: "Incorrect", value: result.incorrectAnswers, color: "#EF4444" }
  ] : []

  const handleTakeAnother = () => {
    router.push("/dashboard")
  }

  const handleRetry = () => {
    router.push(`/dashboard/mode-selection?subject=${subject}`)
  }

  const handleExportPDF = async () => {
    if (!result) return
    setIsExporting(true)
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your official result report...",
    })
    
    const success = await exportToPDF("pdf-report-content", `${result.studentName || user?.displayName || 'Student'}-${subject}-Result.pdf`)
    
    setIsExporting(false)
    if (success) {
      toast({
        title: "Export Successful",
        description: "Your result report has been downloaded.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error generating your PDF. Please try again.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Loading Results...</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <DashboardNavbar />
      
      {/* Hidden PDF Content - Optimized for Export */}
      <div className="fixed left-[-9999px] top-0">
        <ResultReport data={result} subject={subject} />
      </div>

      <main className="container px-4 md:px-8 py-10 max-w-6xl mx-auto space-y-10">
        {/* Header Section with Score and Trophy */}
        <section className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-accent/20">
              <Trophy className="h-20 w-20 text-accent drop-shadow-lg mx-auto mb-4" />
              <div className="text-6xl font-black text-slate-900 tracking-tighter">
                {result.score}%
              </div>
              <p className="text-accent font-black uppercase tracking-[0.2em] text-sm mt-2">
                {result.score >= 90 ? "Excellent!" : result.score >= 70 ? "Great Job!" : result.score >= 50 ? "Passed" : "Needs Practice"}
              </p>
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Performance Summary
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Great job on your {subject} exam! You've shown strong mastery.
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Pie Chart Card */}
          <Card className="md:col-span-1 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="text-center pb-0 pt-8">
              <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Accuracy Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">{result.accuracy}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct</span>
              </div>
            </CardContent>
          </Card>

          {/* Key Stats Cards */}
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Taken</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{result.timeTaken}</div>
              <p className="text-sm font-bold text-slate-500 mt-2">Ahead of 85% students</p>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-emerald-50 p-3 rounded-2xl text-accent">
                  <Target className="h-6 w-6" />
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
              </div>
              <div className="text-4xl font-black text-slate-900">{result.correctAnswers} / {result.totalQuestions}</div>
              <p className="text-sm font-bold text-slate-500 mt-2">Questions answered</p>
            </Card>
          </div>
        </div>

        {/* Detailed Question Review */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Answers</h2>
            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">
              Expand All
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4 px-1">
            {result.questions?.map((q: any, idx: number) => (
              <AccordionItem 
                key={q.id} 
                value={`item-${q.id}`}
                className="border-none bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 px-8 overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center space-x-6 text-left">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black",
                      q.isCorrect ? "bg-emerald-50 text-accent" : "bg-red-50 text-red-500"
                    )}>
                      {q.isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-lg leading-tight">{q.question}</p>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                        Question {idx + 1}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pt-2">
                  <div className="grid md:grid-cols-2 gap-6 pl-16">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Your Answer</p>
                        <div className={cn(
                          "px-4 py-2 rounded-xl font-bold border-2 inline-block",
                          q.isCorrect ? "bg-emerald-50 border-emerald-200 text-accent" : "bg-red-50 border-red-200 text-red-500"
                        )}>
                          {q.userAnswer}
                        </div>
                      </div>
                      {!q.isCorrect && (
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Correct Answer</p>
                          <div className="px-4 py-2 rounded-xl font-bold border-2 bg-emerald-50 border-emerald-200 text-accent inline-block">
                            {q.correctAnswer}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-100/50">
                      <div className="flex items-center space-x-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>Insight</span>
                      </div>
                      <p className="text-blue-900 font-bold leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-wrap items-center justify-center gap-4 pt-10">
          <Button 
            onClick={handleTakeAnother}
            className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 group"
          >
            Take Another Test
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="h-14 px-8 rounded-2xl border-4 border-slate-100 text-slate-500 font-black text-lg hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
          >
            {isExporting ? (
              <div className="flex items-center">
                <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-3" />
                Exporting...
              </div>
            ) : (
              <div className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Export as PDF
              </div>
            )}
          </Button>
          <Button 
            variant="outline"
            className="h-14 px-8 rounded-2xl border-4 border-slate-100 text-slate-500 font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share Score
          </Button>
          <Button 
            variant="ghost"
            onClick={handleRetry}
            className="h-14 px-8 rounded-2xl text-slate-400 font-black text-lg hover:bg-primary/5 transition-all"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Retry
          </Button>
        </section>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
