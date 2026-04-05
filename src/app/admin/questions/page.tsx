"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  X,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const questionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  type: z.enum(["MCQ", "True/False", "Multiple Select"]),
  subject: z.string().min(1, "Please select a subject"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  explanation: z.string().min(10, "Explanation must be at least 10 characters"),
  options: z.array(z.object({
    text: z.string().min(1, "Option text cannot be empty"),
    isCorrect: z.boolean()
  })).min(2, "At least 2 options are required"),
})

type QuestionFormValues = z.infer<typeof questionSchema>

const MOCK_QUESTIONS = [
  { id: "1", question: "What is the result of 15 x 8?", subject: "Mathematics", type: "MCQ", difficulty: "Easy", status: "Published" },
  { id: "2", question: "DNA is the primary genetic storage molecule.", subject: "Biology", type: "True/False", difficulty: "Medium", status: "Published" },
  { id: "3", question: "Solve for x: 2x + 10 = 30", subject: "Mathematics", type: "MCQ", difficulty: "Medium", status: "Draft" },
  { id: "4", question: "Which organs are part of the circulatory system?", subject: "Biology", type: "Multiple Select", difficulty: "Hard", status: "Published" },
]

export default function QuestionsManagementPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const { toast } = useToast()

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      type: "MCQ",
      subject: "",
      difficulty: "Medium",
      explanation: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options"
  })

  const onSubmit = async (data: QuestionFormValues) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log(data)
    setIsSubmitting(false)
    setIsModalOpen(false)
    toast({
      title: "Question Saved",
      description: "The question has been successfully added to the database.",
    })
    form.reset()
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-14 w-56 rounded-2xl" />
          </div>
          <Card className="p-8 rounded-[2rem] border-none shadow-xl space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-12 w-1/3 rounded-xl" />
              <div className="flex space-x-4">
                <Skeleton className="h-12 w-32 rounded-xl" />
                <Skeleton className="h-12 w-32 rounded-xl" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Question Bank</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">Manage and organize your test questions.</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-95">
                <Plus className="mr-2 h-6 w-6" />
                Add New Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-10 border-none shadow-2xl">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-black text-slate-900">Create New Question</DialogTitle>
                <DialogDescription className="text-lg font-bold text-slate-400">Add a new question to the system database.</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-black text-slate-400 uppercase tracking-widest">Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold">
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-none shadow-xl">
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-black text-slate-400 uppercase tracking-widest">Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold">
                                <SelectValue placeholder="Select Difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-none shadow-xl">
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-black text-slate-400 uppercase tracking-widest">Question Text</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the question text here..." 
                            className="min-h-[120px] rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold p-6 focus:bg-white transition-all" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-black text-slate-400 uppercase tracking-widest">Options & Answers</FormLabel>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => append({ text: "", isCorrect: false })}
                        className="text-primary font-black hover:bg-primary/5"
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Option
                      </Button>
                    </div>
                    
                    <div className="grid gap-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-4 animate-in slide-in-from-left-4 fade-in duration-300">
                          <FormField
                            control={form.control}
                            name={`options.${index}.isCorrect`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <button
                                    type="button"
                                    onClick={() => field.onChange(!field.value)}
                                    className={cn(
                                      "h-12 w-12 rounded-xl border-2 transition-all flex items-center justify-center shadow-sm",
                                      field.value 
                                        ? "bg-accent border-accent text-white" 
                                        : "bg-slate-50 border-slate-100 text-slate-300 hover:border-accent/30"
                                    )}
                                  >
                                    <CheckCircle2 className="h-6 w-6" />
                                  </button>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`options.${index}.text`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input 
                                    placeholder={`Option ${index + 1}`} 
                                    className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold focus:bg-white transition-all"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {fields.length > 2 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => remove(index)}
                              className="text-red-400 hover:text-red-500 hover:bg-red-50 h-12 w-12 rounded-xl"
                            >
                              <X className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-black text-slate-400 uppercase tracking-widest">Educational Explanation</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a detailed explanation for the correct answer..." 
                            className="min-h-[100px] rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold p-6 focus:bg-white transition-all" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-6 rounded-2xl bg-blue-50 border-2 border-blue-100 border-dashed flex items-center justify-center cursor-pointer hover:bg-blue-100/50 transition-all group">
                    <div className="text-center">
                      <div className="bg-white p-3 rounded-xl shadow-md inline-block mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-black text-primary uppercase tracking-widest">Upload Question Image (Optional)</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">PNG, JPG or SVG up to 5MB</p>
                    </div>
                  </div>

                  <DialogFooter className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Saving Question...
                        </>
                      ) : (
                        "Save Question to Database"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters & Table */}
        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[3rem] overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search questions by text or keywords..." 
                className="pl-12 h-12 border-none bg-white shadow-lg shadow-slate-200/50 rounded-2xl font-bold"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="h-12 px-6 rounded-2xl border-4 border-white bg-white shadow-lg font-black text-slate-500 hover:bg-slate-50">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="h-12 w-[180px] rounded-2xl border-4 border-white bg-white shadow-lg font-black text-slate-500">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Math">Mathematics</SelectItem>
                  <SelectItem value="Bio">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[400px] py-6 pl-10 font-black text-slate-400 uppercase tracking-widest text-[10px]">Question Content</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Subject</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Type</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Difficulty</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</TableHead>
                  <TableHead className="text-right pr-10 font-black text-slate-400 uppercase tracking-widest text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_QUESTIONS.map((q) => (
                  <TableRow key={q.id} className="group hover:bg-slate-50/50 border-slate-50 transition-colors">
                    <TableCell className="py-6 pl-10">
                      <p className="font-bold text-slate-900 line-clamp-2 leading-relaxed">{q.question}</p>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-primary text-[10px] font-black uppercase tracking-widest">
                        {q.subject}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-bold text-slate-600">{q.type}</span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        q.difficulty === 'Easy' ? "text-accent" : 
                        q.difficulty === 'Medium' ? "text-amber-500" : "text-red-500"
                      )}>
                        {q.difficulty}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          q.status === 'Published' ? "bg-accent shadow-[0_0_8px_#10B981]" : "bg-slate-300"
                        )} />
                        <span className="text-sm font-bold text-slate-500">{q.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5">
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-400">Showing 4 of 124 questions</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled className="h-10 px-4 rounded-xl border-2 font-black text-xs uppercase tracking-widest">Prev</Button>
              <Button variant="outline" className="h-10 px-4 rounded-xl border-2 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all">Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
