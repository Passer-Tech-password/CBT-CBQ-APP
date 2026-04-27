"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
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
  RefreshCcw,
  BookOpen,
  ShieldCheck,
  AlertTriangle
} from "lucide-react"
import { doc, setDoc, collection, addDoc, updateDoc, increment, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { Loader2 } from "lucide-react"

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "practice"
  const subject = searchParams.get("subject") || "Mathematics"
  
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [startTime] = useState(Date.now())
  const [endTime, setEndTime] = useState(Date.now() + 600 * 1000) // 10 minutes from start
  const [timeLeft, setTimeLeft] = useState(600)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [cheatWarnings, setCheatWarnings] = useState(0)
  const { toast } = useToast()

  const { user, userData } = useAuth()

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true)
      try {
        const q = query(
          collection(db, "questions"),
          where("subject", "==", subject)
        )
        const querySnapshot = await getDocs(q)
        const questionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        if (questionsData.length === 0) {
          toast({
            variant: "destructive",
            title: "No Questions Found",
            description: `We couldn't find any questions for ${subject}. Please try another subject.`,
          })
          router.push("/dashboard/mode-selection")
          return
        }

        setQuestions(questionsData)
        
        // Calculate total time based on question time limits
        const totalTime = questionsData.reduce((acc, q: any) => acc + (q.timeLimit || 60), 0)
        setTimeLeft(totalTime)
        setEndTime(Date.now() + totalTime * 1000)
      } catch (error) {
        console.error("Error fetching questions:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load questions. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [subject, toast, router])

  const currentQuestion = questions[currentQuestionIdx]
  const progress = questions.length > 0 ? ((currentQuestionIdx + 1) / questions.length) * 100 : 0

  const handleFinish = useCallback(async () => {
    if (isSubmitting || isFinished || questions.length === 0) return
    setIsSubmitting(true)
    
    let score = 0
    questions.forEach(q => {
      const userAnswer = selectedAnswers[q.id]
      const correctOption = q.options.find((o: any) => o.isCorrect)
      if (userAnswer === correctOption?.text) {
        score++
      }
    })
    
    const percentage = Math.round((score / questions.length) * 100)

    try {
      if (user) {
        // Save result to Firestore
        const resultData = {
          uid: user.uid,
          studentName: userData?.fullName || "Anonymous Student",
          subject,
          mode,
          score: percentage,
          correctAnswers: score,
          totalQuestions: questions.length,
          timeTaken: formatTime((questions.reduce((acc, q: any) => acc + (q.timeLimit || 60), 0)) - timeLeft),
          completedAt: new Date().toISOString(),
          accuracy: percentage,
          questions: questions.map(q => ({
            id: q.id,
            question: q.question,
            userAnswer: selectedAnswers[q.id] || "No Answer",
            correctAnswer: q.options.find((o: any) => o.isCorrect)?.text || "N/A",
            isCorrect: selectedAnswers[q.id] === q.options.find((o: any) => o.isCorrect)?.text,
            explanation: q.explanation
          }))
        }

        await addDoc(collection(db, "results"), resultData)
        
        // Update user stats
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          "stats.testsTaken": increment(1),
          [`stats.${mode === 'competition' ? 'cbqCompetition' : mode === 'timed' ? 'timedExam' : 'practiceMode'}`]: increment(1)
        })

        toast({
          title: "Test Submitted Successfully",
          description: `You scored ${percentage}% in ${subject} ${mode}.`,
        })
      }
    } catch (error: any) {
      console.error("Submission error:", error)
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error saving your results. Please try again.",
      })
    } finally {
      setIsFinished(true)
      setIsSubmitting(false)
      
      if (percentage >= 90) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1E3A8A', '#10B981']
        })
      }
    }
  }, [isSubmitting, isFinished, toast, selectedAnswers, subject, mode, user, timeLeft, questions, userData])

  // Improved Timer logic
  useEffect(() => {
    if (mode === "practice" || isFinished || questions.length === 0) return

    const timer = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
      
      setTimeLeft(remaining)
      
      if (remaining <= 0) {
        clearInterval(timer)
        handleFinish()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [mode, isFinished, handleFinish, endTime, questions.length])

  // Keyboard Navigation
  useEffect(() => {
    if ((isFinished && !isReviewing) || !currentQuestion) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 1-4 for options
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1
        if (currentQuestion.options[idx]) {
          handleAnswerSelect(currentQuestion.options[idx].text)
        }
      }
      
      // Arrow keys for navigation
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentQuestionIdx < questions.length - 1) {
          nextQuestion()
        } else if (e.key === 'Enter' && !isReviewing) {
          handleFinish()
        }
      }
      if (e.key === 'ArrowLeft') {
        prevQuestion()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentQuestionIdx, currentQuestion, isFinished, isReviewing, questions.length])

  // Anti-cheat: Detect tab switching and window blur
  useEffect(() => {
    if (isFinished || mode === "practice" || questions.length === 0) return

    const handleViolation = () => {
      setCheatWarnings(prev => {
        const newCount = prev + 1
        toast({
          variant: "destructive",
          title: "Security Warning",
          description: "Unauthorized window activity detected. Please stay focused on the exam.",
        })
        if (newCount >= 3) {
          handleFinish()
          toast({
            variant: "destructive",
            title: "Exam Terminated",
            description: "Maximum security violations reached. Test auto-submitted.",
          })
        }
        return newCount
      })
    }

    const handleVisibilityChange = () => {
      if (document.hidden) handleViolation()
    }

    const handleBlur = () => {
      // Small delay to prevent accidental triggers
      setTimeout(() => {
        if (!document.hasFocus()) handleViolation()
      }, 100)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [isFinished, mode, handleFinish, toast, questions.length])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (optionText: string) => {
    if (isFinished && !isReviewing) return
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionText
    })
  }

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-bold">Loading questions for {subject}...</p>
      </div>
    )
  }

  if (isFinished && !isReviewing) {
    let score = 0
    questions.forEach(q => {
      const userAnswer = selectedAnswers[q.id]
      const correctOption = q.options.find((o: any) => o.isCorrect)
      if (userAnswer === correctOption?.text) {
        score++
      }
    })
    const percentage = Math.round((score / questions.length) * 100)
    
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

          <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-[3rem]">
            <CardHeader className="bg-primary text-white pb-12 pt-10">
              <CardTitle className="text-lg font-bold uppercase tracking-widest opacity-80">Final Score</CardTitle>
              <div className="text-7xl font-black mt-2">{percentage}%</div>
            </CardHeader>
            <CardContent className="p-10 -mt-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Correct</p>
                  <p className="text-3xl font-black text-accent">{score}</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Questions</p>
                  <p className="text-3xl font-black text-primary">{questions.length}</p>
                </div>
              </div>
              
              <div className="mt-10 space-y-4">
                <Button 
                  className="w-full h-16 rounded-2xl text-white font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
                  onClick={() => {
                    setIsReviewing(true)
                    setCurrentQuestionIdx(0)
                  }}
                >
                  <BookOpen className="mr-3 h-6 w-6" />
                  Detailed Review
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-2xl border-4 border-slate-100 font-black text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Retry
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-14 rounded-2xl border-4 border-slate-100 font-black text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                    onClick={() => router.push("/dashboard")}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Dashboard
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
            <span className="text-primary font-black">{currentQuestionIdx + 1} / {questions.length}</span>
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
          {cheatWarnings > 0 && mode !== "practice" && (
            <div className="bg-red-100 text-red-600 p-2 rounded-xl flex items-center px-4 font-black text-xs">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Security: {cheatWarnings}/3
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-slate-50/30">
        <div className="w-full max-w-5xl space-y-12">
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-10"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary font-black text-xl flex-shrink-0">
                  {currentQuestionIdx + 1}
                </span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {currentQuestion.question}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {currentQuestion.options.map((option: any, idx: number) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.text
                const correctOptionText = currentQuestion.options.find((o: any) => o.isCorrect)?.text
                const isCorrect = isReviewing && option.text === correctOptionText
                const isWrong = isReviewing && isSelected && option.text !== correctOptionText

                return (
                  <motion.button
                    key={idx}
                    whileHover={!isReviewing ? { scale: 1.02, y: -4 } : {}}
                    whileTap={!isReviewing ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswerSelect(option.text)}
                    disabled={isReviewing}
                    className={cn(
                      "relative p-8 rounded-[2.5rem] text-left transition-all group border-4 text-xl font-black min-h-[120px] shadow-xl",
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
                      <span className="flex-1">{option.text}</span>
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

            <AnimatePresence>
              {isReviewing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-4xl mx-auto p-10 rounded-[3rem] bg-blue-600 text-white shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="relative z-10 text-left flex items-start space-x-6">
                    <div className="bg-white/20 p-4 rounded-2xl">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="font-black uppercase tracking-[0.2em] mb-2 text-blue-100 text-xs">
                        Educational Insight
                      </div>
                      <p className="text-xl font-bold leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

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
          {questions.map((_, idx) => (
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
          {currentQuestionIdx === questions.length - 1 && !isReviewing ? (
            <Button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="h-14 px-10 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black text-lg shadow-xl shadow-emerald-200 transition-all active:scale-95 group"
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
              <ShieldCheck className="ml-3 h-6 w-6" />
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={isReviewing && currentQuestionIdx === questions.length - 1}
              className={cn(
                "h-14 px-10 rounded-2xl text-white font-black text-lg shadow-xl transition-all active:scale-95 group",
                currentQuestionIdx === questions.length - 1 ? "bg-primary" : "bg-primary hover:bg-primary/90 shadow-primary/20"
              )}
            >
              {currentQuestionIdx === questions.length - 1 ? "Finish Review" : "Next Question"}
              <ChevronRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  )
}
