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
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const subjects = [
  {
    name: "Mathematics",
    description: "Algebra, Calculus, and Geometry challenges.",
    icon: Calculator,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    questions: 120,
    tests: 12
  },
  {
    name: "English",
    description: "Grammar, Literature, and Comprehension.",
    icon: BookOpen,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    questions: 85,
    tests: 8
  },
  {
    name: "Physics",
    description: "Mechanics, Optics, and Thermodynamics.",
    icon: FlaskConical,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    questions: 150,
    tests: 15
  },
  {
    name: "Chemistry",
    description: "Organic, Inorganic, and Physical Chemistry.",
    icon: FlaskConical,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    questions: 95,
    tests: 10
  },
  {
    name: "Biology",
    description: "Genetics, Anatomy, and Ecology studies.",
    icon: FlaskConical,
    color: "bg-rose-500",
    lightColor: "bg-rose-50",
    textColor: "text-rose-600",
    questions: 110,
    tests: 11
  },
  {
    name: "Computer",
    description: "Coding, Algorithms, and System Architecture.",
    icon: Code,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    questions: 200,
    tests: 20
  }
]

export function SubjectGrid() {
  const router = useRouter()

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
        {subjects.map((subject, idx) => (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -8 }}
            onClick={() => router.push(`/dashboard/mode-selection?subject=${subject.name}`)}
            className="group cursor-pointer"
          >
            <Card className="h-full border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden transition-all group-hover:shadow-2xl group-hover:shadow-primary/10">
              <CardHeader className="p-8 pb-4">
                <div className={`${subject.lightColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                  <subject.icon className={`h-7 w-7 ${subject.textColor}`} />
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 leading-none mb-2">{subject.name}</CardTitle>
                <CardDescription className="text-slate-500 font-bold text-sm leading-relaxed">{subject.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Questions</span>
                    <span className="text-lg font-black text-slate-900">{subject.questions}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Tests</span>
                    <span className="text-lg font-black text-slate-900">{subject.tests}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button className={`w-full ${subject.color} hover:opacity-90 text-white font-black rounded-xl h-12 shadow-lg transition-all flex items-center justify-center group-hover:translate-y-[-2px]`}>
                  Take Test
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
