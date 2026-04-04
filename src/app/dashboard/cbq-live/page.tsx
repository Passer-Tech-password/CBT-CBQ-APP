"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flag, 
  GraduationCap, 
  CheckCircle2, 
  XCircle,
  Trophy,
  Users,
  Zap,
  ShieldCheck,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Mock questions
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary function of DNA?",
    options: ["Energy production", "Genetic storage", "Protein synthesis", "Cell structure"],
    correctAnswer: "Genetic storage",
    explanation: "DNA (Deoxyribonucleic acid) is the molecule that carries genetic instructions for life."
  },
  {
    id: 2,
    question: "Which organ is responsible for pumping blood?",
    options: ["Lungs", "Brain", "Heart", "Liver"],
    correctAnswer: "Heart",
    explanation: "The heart is a muscular organ that pumps blood throughout the circulatory system."
  }
]

// Mock Leaderboard Data
const MOCK_LEADERBOARD = [
  { id: 1, name: "Alice Johnson", score: 950, rank: 1, avatar: "Alice" },
  { id: 2, name: "Bob Smith", score: 880, rank: 2, avatar: "Bob" },
  { id: 3, name: "Charlie Brown", score: 820, rank: 3, avatar: "Charlie" },
  { id: 4, name: "Diana Prince", score: 790, rank: 4, avatar: "Diana" },
  { id: 5, name: "Edward Norton", score: 750, rank: 5, avatar: "Edward" },
  { id: 6, name: "Fiona Apple", score: 710, rank: 6, avatar: "Fiona" }
]

function LiveCBQContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subject = searchParams.get("subject") || "Biology"
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds per question in live mode
  const [isFinished, setIsFinished] = useState(false)
  const [participants, setParticipants] = useState(1240)

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIdx]
  const progress = ((currentQuestionIdx + 1) / MOCK_QUESTIONS.length) * 100

  useEffect(() => {
    if (isFinished) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestionIdx < MOCK_QUESTIONS.length - 1) {
            setCurrentQuestionIdx(prevIdx => prevIdx + 1)
            return 60
          } else {
            setIsFinished(true)
            clearInterval(timer)
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentQuestionIdx, isFinished])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: option })
  }

  const LeaderboardContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Live Participants</span>
        </div>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">
          {participants.toLocaleString()} Online
        </span>
      </div>
      <div className="space-y-3">
        {MOCK_LEADERBOARD.map((user) => (
          <div key={user.id} className={cn(
            "flex items-center justify-between p-4 rounded-[1.5rem] transition-all border-2",
            user.rank === 1 ? "bg-amber-50 border-amber-100" : "bg-white border-slate-50 shadow-sm"
          )}>
            <div className="flex items-center space-x-4">
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black",
                user.rank === 1 ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
              )}>
                #{user.rank}
              </div>
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-bold text-slate-900 truncate max-w-[120px]">{user.name}</span>
            </div>
            <span className="font-black text-primary">{user.score}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full rounded-[3rem] p-10 text-center space-y-8 shadow-2xl">
          <Trophy className="h-24 w-24 text-accent mx-auto" />
          <h1 className="text-3xl font-black text-slate-900">Competition Ended!</h1>
          <p className="text-slate-500 font-bold">Calculating final rankings and scores...</p>
          <Button 
            onClick={() => router.push(`/dashboard/results?subject=${subject}`)}
            className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg"
          >
            View My Result
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* Sidebar Leaderboard (Desktop) */}
      <aside className="hidden lg:block w-[400px] border-r bg-slate-50/50 p-10 overflow-y-auto h-screen sticky top-0">
        <div className="mb-10">
          <div className="flex items-center space-x-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-2">
            <Zap className="h-4 w-4 text-accent" />
            <span>Live Competition</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            National {subject} Challenge
          </h2>
        </div>
        <LeaderboardContent />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white px-4 md:px-12 h-24 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center">
              <span className="h-2 w-2 bg-white rounded-full mr-2" />
              Live
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{subject} Quiz</h1>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Round 1/3</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl px-12 hidden lg:block">
            <Progress value={progress} className="h-3 bg-slate-100 rounded-full" indicatorClassName="bg-primary" />
          </div>

          <div className="flex items-center space-x-4">
            <div className={cn(
              "flex items-center px-6 py-3 rounded-2xl font-black text-2xl tracking-tighter transition-all shadow-inner",
              timeLeft < 10 ? "bg-red-50 text-red-600 animate-pulse border-2 border-red-100" : "bg-blue-50 text-blue-600 border-2 border-blue-100"
            )}>
              <Clock className="h-6 w-6 mr-3" />
              {formatTime(timeLeft)}
            </div>
            {/* Mobile Leaderboard Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden h-12 w-12 rounded-xl border-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-[3rem] p-10">
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-2xl font-black">Live Leaderboard</SheetTitle>
                </SheetHeader>
                <LeaderboardContent />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Question Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-slate-50/30">
          <div className="w-full max-w-4xl space-y-12">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center space-y-10"
            >
              <div className="space-y-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em]">
                  Question {currentQuestionIdx + 1}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(option)}
                      className={cn(
                        "relative p-8 rounded-[2rem] text-left transition-all group border-4 text-xl font-black min-h-[120px] shadow-xl",
                        isSelected ? "bg-white border-primary text-primary shadow-primary/10" : "bg-white border-transparent hover:border-slate-200 text-slate-600 shadow-slate-200/50"
                      )}
                    >
                      <div className="flex items-center space-x-6">
                        <div className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all",
                          isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="h-24 border-t bg-white px-12 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center space-x-4 text-slate-400 font-black uppercase tracking-widest text-xs">
            <ShieldCheck className="h-5 w-5" />
            <span>Anti-Cheat Enabled</span>
          </div>
          <Button 
            className="h-14 px-12 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
            onClick={() => {
              if (currentQuestionIdx < MOCK_QUESTIONS.length - 1) {
                setCurrentQuestionIdx(prev => prev + 1)
                setTimeLeft(60)
              } else {
                setIsFinished(true)
              }
            }}
          >
            Lock Answer
            <ChevronRight className="ml-3 h-6 w-6" />
          </Button>
        </footer>
      </div>
    </div>
  )
}

export default function LiveCBQPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <LiveCBQContent />
    </Suspense>
  )
}
