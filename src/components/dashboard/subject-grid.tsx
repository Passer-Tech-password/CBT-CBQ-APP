"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { 
  Calculator, 
  BookOpen, 
  FlaskConical, 
  Globe, 
  History, 
  Code, 
  Palette, 
  Music,
  ChevronRight,
  ArrowRight,
  Activity,
  Zap,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, any> = {
  "Mathematics": Calculator,
  "Maths": Calculator,
  "English": BookOpen,
  "English Language": BookOpen,
  "Physics": FlaskConical,
  "Chemistry": FlaskConical,
  "Biology": FlaskConical,
  "Computer": Code,
  "History": History,
  "Geography": Globe,
  "Art": Palette,
  "Music": Music,
  "Science": FlaskConical,
  "Quantitative Reasoning": Activity,
  "Verbal Reasoning": Zap,
  "General Paper": FileText,
}

const COLOR_MAP: Record<string, { color: string, light: string, text: string }> = {
  "Mathematics": { color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
  "Maths": { color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
  "English": { color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600" },
  "English Language": { color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600" },
  "Physics": { color: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600" },
  "Chemistry": { color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" },
  "Biology": { color: "bg-rose-500", light: "bg-rose-50", text: "text-rose-600" },
  "Computer": { color: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-600" },
  "Quantitative Reasoning": { color: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600" },
  "Verbal Reasoning": { color: "bg-cyan-500", light: "bg-cyan-50", text: "text-cyan-600" },
  "General Paper": { color: "bg-slate-500", light: "bg-slate-50", text: "text-slate-600" },
  "General": { color: "bg-slate-500", light: "bg-slate-50", text: "text-slate-600" },
}

export function SubjectGrid() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const q = query(collection(db, "subjects"), orderBy("name"), limit(8))
        const querySnapshot = await getDocs(q)
        const subjectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSubjects(subjectsData)
      } catch (error) {
        console.error("Error fetching subjects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-64 rounded-[2rem]" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Subjects</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/dashboard/mode-selection")}
          className="text-primary font-bold flex items-center hover:bg-primary/5"
        >
          View all <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {subjects.map((subject, index) => {
          const style = COLOR_MAP[subject.name] || COLOR_MAP["General"]
          const Icon = ICON_MAP[subject.name] || BookOpen

          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card 
                className="group relative overflow-hidden rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white h-full flex flex-col"
                onClick={() => router.push(`/dashboard/mode-selection?subject=${encodeURIComponent(subject.name)}`)}
              >
                <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150", style.color)} />
                
                <CardHeader className="relative space-y-4 pb-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 group-hover:rotate-12", style.color)}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900">{subject.name}</CardTitle>
                    <CardDescription className="text-slate-500 font-bold mt-1 line-clamp-2">{subject.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="relative flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={cn("px-4 py-2 rounded-xl font-black text-sm", style.light, style.text)}>
                      {subject.questions || 0} Questions
                    </div>
                    <div className="text-slate-400 font-bold text-sm">
                      {subject.tests || 0} Tests
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="relative pt-0 pb-8">
                  <Button 
                    className={cn("w-full h-14 rounded-2xl font-black text-lg shadow-lg transition-all duration-300 group-hover:translate-y-[-4px]", style.color, "hover:brightness-110")}
                  >
                    Start Practice
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
