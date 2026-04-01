"use client"

import { useState, useEffect, useCallback } from "react"
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
  BarChart,
  RefreshCcw,
  BookOpen,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Mock questions for initial development
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the result of 15 x 8?",
    options: ["100", "110", "120", "130"],
    correctAnswer: "120",
    explanation: "15 multiplied by 8 equals 120."
  },
  {
    id: 2,
    question: "Solve for x: 2x + 10 = 30",
    options: ["5", "10", "15", "20"],
    correctAnswer: "10",
    explanation: "Subtract 10 from both sides: 2x = 20. Divide by 2: x = 10."
  },
  {
    id: 3,
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "14"],
    correctAnswer: "12",
    explanation: "12 x 12 = 144."
  },
  {
    id: 4,
    question: "If a triangle has angles 60° and 90°, what is the third angle?",
    options: ["30°", "45°", "60°", "90°"],
    correctAnswer: "30°",
    explanation: "The sum of angles in a triangle is 180°. 180 - 60 - 90 = 30."
  },
  {
    id: 5,
    question: "What is the value of Pi (π) rounded to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    correctAnswer: "3.14",
    explanation: "Pi is approximately 3.14159..."
  }
]

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "practice"
  const subject = searchParams.get("subject") || "Mathematics"
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const { toast } = useToast()

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIdx]
  const progress = ((currentQuestionIdx + 1) / MOCK_QUESTIONS.length) * 100

  const handleFinish = useCallback(async () => {
    if (isSubmitting || isFinished) return
    setIsSubmitting(true)
    
    // Final save logic would go here
    setIsFinished(true)
    setIsSubmitting(false)
    
    toast({
      title: "Quiz Completed!",
      description: "Your answers have been securely submitted.",
    })
  }, [isSubmitting, isFinished, toast])

  useEffect(() => {
    if (mode === "practice" || isFinished) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [mode, isFinished, handleFinish])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (option: string) => {
    if (isFinished && !isReviewing) return
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: option
    })
  }

  const nextQuestion = () => {
    if (currentQuestionIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
    } else if (!isReviewing) {
      handleFinish()
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1)
    }
  }

  const calculateScore = () => {
    let score = 0
    MOCK_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++
      }
    })
    return score
  }

  if (isFinished && !isReviewing) {
    const score = calculateScore()
    const percentage = (score / MOCK_QUESTIONS.length) * 100
    
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl text-center space-y-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
            <Trophy className="h-24 w-24 text-accent mx-auto relative drop-shadow-xl" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900">Excellent Work!</h1>
            <p className="text-slate-500 text-lg">You've completed the {subject} {mode} test.</p>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden bg-white">
            <CardHeader className="bg-primary text-white pb-12 pt-8">
              <CardTitle className="text-lg font-bold uppercase tracking-widest opacity-80">Final Score</CardTitle>
              <div className="text-6xl font-black mt-2">{percentage}%</div>
            </CardHeader>
            <CardContent className="p-8 -mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Correct</p>
                  <p className="text-2xl font-black text-accent">{score}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Questions</p>
                  <p className="text-2xl font-black text-primary">{MOCK_QUESTIONS.length}</p>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <Button 
                  className="w-full h-12 rounded-xl text-white font-bold bg-primary hover:bg-primary/90 shadow-lg"
                  onClick={() => {
                    setIsReviewing(true)
                    setCurrentQuestionIdx(0)
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Review Answers
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-12 rounded-xl border-2 border-slate-200 font-bold hover:bg-slate-50"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 rounded-xl border-2 border-slate-200 font-bold hover:bg-slate-50"
                    onClick={() => router.push("/dashboard")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Exit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white px-4 md:px-12 h-24 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-400 hover:text-primary transition-colors">
            <XCircle className="h-8 w-8" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{subject}</h1>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{mode} session</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-12 hidden lg:block">
          <div className="flex items-center justify-between text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
            <span>Progress</span>
            <span className="text-primary">{currentQuestionIdx + 1} / {MOCK_QUESTIONS.length}</span>
          </div>
          <Progress value={progress} className="h-3 bg-slate-100 rounded-full overflow-hidden" indicatorClassName="bg-primary" />
        </div>

        <div className="flex items-center space-x-4">
          {mode !== "practice" && (
            <div className={cn(
              "flex items-center px-6 py-3 rounded-2xl font-black text-xl tracking-tighter transition-all shadow-inner",
              timeLeft < 60 ? "bg-red-50 text-red-600 animate-pulse border-2 border-red-100" : "bg-blue-50 text-blue-600 border-2 border-blue-100"
            )}>
              <Clock className="h-6 w-6 mr-3" />
              {formatTime(timeLeft)}
            </div>
          )}
          <Button variant="outline" className="hidden sm:flex border-2 border-slate-100 h-12 px-6 rounded-xl font-black text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
            <Flag className="h-5 w-5 mr-2" />
            Flag
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-slate-50/30">
        <div className="w-full max-w-5xl space-y-12">
          {/* Question Section */}
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-10"
          >
            <div className="space-y-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em]">
                Question {currentQuestionIdx + 1}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight max-w-4xl mx-auto">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Grid (2x2 on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option
                const isCorrect = isReviewing && option === currentQuestion.correctAnswer
                const isWrong = isReviewing && isSelected && option !== currentQuestion.correctAnswer

                return (
                  <motion.button
                    key={idx}
                    whileHover={!isReviewing ? { scale: 1.02, y: -4 } : {}}
                    whileTap={!isReviewing ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isReviewing}
                    className={cn(
                      "relative p-8 rounded-[2rem] text-left transition-all group border-4 text-xl font-black min-h-[120px] shadow-xl",
                      isSelected && !isReviewing && "bg-white border-primary text-primary shadow-primary/10",
                      !isSelected && !isReviewing && "bg-white border-transparent hover:border-slate-200 text-slate-600 shadow-slate-200/50",
                      isCorrect && "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-emerald-100",
                      isWrong && "bg-red-50 border-red-500 text-red-600 shadow-red-100",
                      isReviewing && !isCorrect && !isWrong && "opacity-40 grayscale-[0.5]"
                    )}
                  >
                    <div className="flex items-center space-x-6">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all shadow-inner",
                        isSelected && !isReviewing && "bg-primary text-white",
                        !isSelected && !isReviewing && "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary",
                        isCorrect && "bg-emerald-500 text-white",
                        isWrong && "bg-red-500 text-white"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                    {isCorrect && (
                      <div className="absolute top-4 right-4 bg-emerald-500 rounded-full p-1 shadow-lg">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {isWrong && (
                      <div className="absolute top-4 right-4 bg-red-500 rounded-full p-1 shadow-lg">
                        <XCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation Section for Review */}
            <AnimatePresence>
              {isReviewing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-4xl mx-auto p-10 rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="relative z-10 text-left">
                    <div className="flex items-center space-x-3 font-black uppercase tracking-[0.2em] mb-4 text-blue-100">
                      <GraduationCap className="h-6 w-6" />
                      <span>Educational Insight</span>
                    </div>
                    <p className="text-xl font-bold leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 z-50 w-full border-t bg-white px-4 md:px-12 h-24 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <Button
          variant="ghost"
          onClick={prevQuestion}
          disabled={currentQuestionIdx === 0}
          className="h-14 px-8 rounded-2xl font-black text-slate-400 hover:text-primary hover:bg-primary/5 transition-all group"
        >
          <ChevronLeft className="mr-3 h-6 w-6 transition-transform group-hover:-translate-x-1" />
          Previous
        </Button>

        <div className="hidden md:flex items-center space-x-3">
          {MOCK_QUESTIONS.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                currentQuestionIdx === idx ? "w-10 bg-primary shadow-lg shadow-primary/20" : "w-2 bg-slate-200"
              )}
            />
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {currentQuestionIdx === MOCK_QUESTIONS.length - 1 && !isReviewing ? (
            <Button
              onClick={handleFinish}
              className="h-14 px-10 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black text-lg shadow-xl shadow-emerald-200 transition-all active:scale-95 group"
            >
              Submit Test
              <ShieldCheck className="ml-3 h-6 w-6" />
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={isReviewing && currentQuestionIdx === MOCK_QUESTIONS.length - 1}
              className={cn(
                "h-14 px-10 rounded-2xl text-white font-black text-lg shadow-xl transition-all active:scale-95 group",
                currentQuestionIdx === MOCK_QUESTIONS.length - 1 ? "bg-primary" : "bg-primary hover:bg-primary/90 shadow-primary/20"
              )}
            >
              {currentQuestionIdx === MOCK_QUESTIONS.length - 1 ? "Finish Review" : "Next Question"}
              <ChevronRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </footer>

      {/* Mobile Progress Bar (Sticky) */}
      <div className="md:hidden sticky top-16 z-40 bg-white px-4 py-2 border-b">
        <Progress value={progress} className="h-1.5 bg-slate-100" indicatorClassName="bg-primary" />
      </div>
    </div>
  )
}
