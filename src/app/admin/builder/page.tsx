"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 
  GripVertical, 
  Trash2, 
  Save, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Layout,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  text: string
  subject: string
  difficulty: string
}

interface QuizQuestion extends Question {
  order: number
}

export default function QuizBuilderPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [quizDuration, setQuizDuration] = useState("60")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const q = query(collection(db, "questions"))
      const querySnapshot = await getDocs(q)
      const fetchedQuestions: Question[] = []
      querySnapshot.forEach((doc) => {
        fetchedQuestions.push({ id: doc.id, ...doc.data() } as Question)
      })
      setQuestions(fetchedQuestions)
    } catch (error) {
      console.error("Error fetching questions:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions. Please check your Firebase config.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addQuestionToQuiz = (question: Question) => {
    if (selectedQuestions.find(q => q.id === question.id)) {
      toast({
        title: "Already Added",
        description: "This question is already in your quiz.",
      })
      return
    }
    setSelectedQuestions([
      ...selectedQuestions,
      { ...question, order: selectedQuestions.length }
    ])
  }

  const removeQuestionFromQuiz = (id: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== id))
  }

  const handleSaveQuiz = async () => {
    if (!quizTitle || selectedQuestions.length === 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Quiz",
        description: "Please provide a title and add at least one question.",
      })
      return
    }

    setIsSaving(true)
    try {
      await addDoc(collection(db, "quizzes"), {
        title: quizTitle,
        description: quizDescription,
        duration: parseInt(quizDuration),
        questionIds: selectedQuestions.map(q => q.id),
        createdAt: serverTimestamp(),
        status: "draft"
      })

      toast({
        title: "Quiz Saved!",
        description: "Your custom quiz has been successfully created.",
      })
      
      // Reset form
      setQuizTitle("")
      setQuizDescription("")
      setSelectedQuestions([])
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "An error occurred while saving the quiz.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-primary font-black uppercase tracking-widest text-xs">
              <Sparkles className="h-4 w-4" />
              <span>Assessment Engine</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Quiz <span className="text-primary">Builder</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-md">
              Construct high-performance assessments by selecting from your global question bank.
            </p>
          </div>
          <Button 
            onClick={handleSaveQuiz}
            disabled={isSaving}
            className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 font-black text-lg gap-3"
          >
            {isSaving ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-6 w-6" />
            )}
            PUBLISH ASSESSMENT
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Quiz Configuration */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Layout className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black text-slate-900">Assessment Details</CardTitle>
                    <CardDescription className="font-medium">Define the core metadata for this quiz</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Quiz Title</label>
                    <Input 
                      placeholder="e.g. Mid-Term Physics Challenge"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl font-bold text-lg px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Duration (Minutes)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                      <Input 
                        type="number"
                        value={quizDuration}
                        onChange={(e) => setQuizDuration(e.target.value)}
                        className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl font-bold text-lg pl-12 pr-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Description</label>
                  <Input 
                    placeholder="Enter assessment instructions or summary..."
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl font-bold px-6"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Selected Questions List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Assessment Structure
                  <span className="ml-2 text-sm font-black bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {selectedQuestions.length} Questions
                  </span>
                </h3>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {selectedQuestions.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center space-y-4"
                    >
                      <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Plus className="h-10 w-10 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-slate-900">Your quiz is empty</p>
                        <p className="text-slate-500 font-medium">Select questions from the right panel to begin building.</p>
                      </div>
                    </motion.div>
                  ) : (
                    selectedQuestions.map((q, index) => (
                      <motion.div
                        key={q.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center gap-6"
                      >
                        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary text-white font-black shrink-0 shadow-lg shadow-primary/30">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate leading-tight mb-1">{q.text}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                              {q.subject}
                            </span>
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                              q.difficulty === "Easy" ? "bg-emerald-100 text-emerald-600" :
                              q.difficulty === "Medium" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                            )}>
                              {q.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-12 w-12 rounded-2xl text-slate-400 hover:text-primary hover:bg-primary/5"
                          >
                            <GripVertical className="h-6 w-6" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeQuestionFromQuiz(q.id)}
                            className="h-12 w-12 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-6 w-6" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Question Bank */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] flex flex-col h-[800px]">
              <CardHeader className="p-8 pb-4 shrink-0">
                <CardTitle className="text-xl font-black text-slate-900">Question Bank</CardTitle>
                <CardDescription className="font-medium">Browse and add questions</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <Input 
                    placeholder="Filter questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 border-slate-100 bg-slate-50 focus:bg-white rounded-xl pl-12 pr-4 font-bold"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 overflow-y-auto flex-1 custom-scrollbar">
                <div className="space-y-3 p-4">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-2xl" />
                    ))
                  ) : filteredQuestions.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <AlertCircle className="h-10 w-10 text-slate-300 mx-auto" />
                      <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No matches found</p>
                    </div>
                  ) : (
                    filteredQuestions.map((q) => (
                      <div 
                        key={q.id}
                        className="group bg-slate-50/50 hover:bg-white p-4 rounded-2xl border border-transparent hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden"
                        onClick={() => addQuestionToQuiz(q)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{q.text}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary/70">{q.subject}</span>
                              <div className="h-1 w-1 rounded-full bg-slate-300" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{q.difficulty}</span>
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm transition-transform group-hover:scale-110">
                            <Plus className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <CheckCircle2 className="h-6 w-6" />
                <h4 className="font-black text-slate-900">Builder Pro-Tip</h4>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                You can mix questions from different subjects to create cross-disciplinary assessments. Quizzes are saved as <span className="text-primary font-bold italic">Drafts</span> by default.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
