"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Play, 
  Clock, 
  Trophy, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardNavbar } from "@/components/dashboard/navbar"

export default function ModeSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subject = searchParams.get("subject") || "Mathematics"
  const [questionCount, setQuestionCount] = useState("20")

  const modes = [
    {
      id: "practice",
      title: "Practice Mode",
      description: "Learn at your own pace. See instant explanations for every answer.",
      icon: Play,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      features: ["Unlimited Time", "Instant Feedback", "All Questions", "No Penalty"],
      buttonText: "Start Practice",
      path: `/dashboard/quiz?mode=practice&subject=${subject}&count=${questionCount}`
    },
    {
      id: "exam",
      title: "Timed Exam",
      description: "Simulate a real exam environment with strict timing and no hints.",
      icon: Clock,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      features: ["Strict Timer", "Review at End", "Randomized Set", "Exam Certificate"],
      buttonText: "Begin Exam",
      path: `/dashboard/quiz?mode=exam&subject=${subject}&count=${questionCount}`
    },
    {
      id: "cbq",
      title: "CBQ Competition",
      description: "Join the live battle! Real-time leaderboard and massive prizes.",
      icon: Trophy,
      color: "bg-purple-600",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      features: ["Live Leaderboard", "High Stakes", "Timed Questions", "Rankings"],
      buttonText: "Join Competition",
      path: `/dashboard/quiz?mode=cbq&subject=${subject}&count=${questionCount}`
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <DashboardNavbar />
      
      <main className="container px-4 md:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 hover:bg-white text-slate-500 font-bold rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
            >
              <Zap className="h-4 w-4 text-accent" />
              <span>Challenge Configuration</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Select {subject} Mode
            </h1>
            
            {/* Question Count Selector */}
            <div className="flex flex-col items-center space-y-4 pt-4">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Question Count</p>
              <div className="flex p-1.5 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-2 border-slate-100">
                {["10", "20", "50"].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={cn(
                      "px-8 py-3 rounded-xl text-sm font-black transition-all",
                      questionCount === count 
                        ? "bg-primary text-white shadow-lg" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {modes.map((mode, idx) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -12 }}
                className="flex"
              >
                <Card className="relative flex flex-col border-none shadow-2xl shadow-slate-200/50 overflow-hidden group bg-white rounded-[2rem]">
                  <div className={`h-3 w-full ${mode.color}`} />
                  
                  <CardHeader className="pb-6 pt-10 px-8 text-center">
                    <div className={`w-20 h-20 mx-auto rounded-[2rem] ${mode.lightColor} flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                      <mode.icon className={`h-10 w-10 ${mode.textColor}`} />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 mb-2">{mode.title}</CardTitle>
                    <CardDescription className="text-slate-500 font-bold text-sm leading-relaxed px-4">
                      {mode.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-4 px-10">
                    <div className="h-px w-full bg-slate-100 mb-6" />
                    {mode.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm font-black text-slate-600">
                        <div className={`h-2 w-2 rounded-full mr-4 ${mode.color}`} />
                        {feature}
                      </div>
                    ))}
                  </CardContent>

                  <div className="p-10 pt-6">
                    <Button 
                      onClick={() => router.push(mode.path)}
                      className={`w-full h-14 rounded-2xl text-white text-lg font-black transition-all shadow-xl group-hover:shadow-2xl ${mode.color} hover:brightness-110 active:scale-[0.98]`}
                    >
                      {mode.buttonText}
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center space-x-8 text-slate-400 font-medium pt-8"
          >
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              Secure Environment
            </div>
            <div className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Verified Results
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
