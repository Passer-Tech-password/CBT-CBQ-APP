"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  BookOpen,
  RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, writeBatch } from "firebase/firestore"

const subjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().min(1, "Category is required"), // e.g., Primary, Secondary
})

const DEFAULT_SUBJECTS = [
  { name: "Mathematics", description: "Primary school mathematics covering arithmetic, geometry, and basic algebra.", category: "Primary" },
  { name: "English Language", description: "Grammar, vocabulary, comprehension, and creative writing for primary levels.", category: "Primary" },
  { name: "Quantitative Reasoning", description: "Numerical and mathematical problem-solving skills and logic.", category: "Primary" },
  { name: "Verbal Reasoning", description: "Logic and linguistic skills using words, letters, and numbers.", category: "Primary" },
  { name: "General Paper", description: "General knowledge, current affairs, and basic science/social studies.", category: "Primary" },
]

type SubjectFormValues = z.infer<typeof subjectSchema>

interface Subject extends SubjectFormValues {
  id: string
}

export default function SubjectsManagementPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [subjects, setSubjects] = React.useState<Subject[]>([])
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const { toast } = useToast()

  const fetchSubjects = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const q = query(collection(db, "subjects"), orderBy("name"))
      const querySnapshot = await getDocs(q)
      const subjectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subject[]
      setSubjects(subjectsData)
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load subjects. Please check your permissions.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "General",
    }
  })

  const onSubmit = async (data: SubjectFormValues) => {
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateDoc(doc(db, "subjects", editingId), data)
        toast({
          title: "Subject Updated",
          description: `${data.name} has been successfully updated.`,
        })
      } else {
        await addDoc(collection(db, "subjects"), data)
        toast({
          title: "Subject Added",
          description: `${data.name} has been successfully added.`,
        })
      }
      setIsModalOpen(false)
      setEditingId(null)
      form.reset()
      fetchSubjects()
    } catch (error) {
      console.error("Error saving subject:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save subject. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSeed = async () => {
    setIsSubmitting(true)
    try {
      const batch = writeBatch(db)
      DEFAULT_SUBJECTS.forEach((subject) => {
        // Check if subject already exists to avoid duplicates
        const exists = subjects.some(s => s.name === subject.name)
        if (!exists) {
          const newDocRef = doc(collection(db, "subjects"))
          batch.set(newDocRef, subject)
        }
      })
      await batch.commit()
      toast({
        title: "Subjects Seeded",
        description: "Default primary school subjects have been added.",
      })
      fetchSubjects()
    } catch (error) {
      console.error("Error seeding subjects:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to seed subjects.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id)
    form.reset({
      name: subject.name,
      description: subject.description,
      category: subject.category || "General",
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, "subjects", id))
        toast({
          title: "Subject Deleted",
          description: `${name} has been removed.`,
        })
        fetchSubjects()
      } catch (error) {
        console.error("Error deleting subject:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete subject.",
        })
      }
    }
  }

  if (isLoading && subjects.length === 0) {
    return (
      <div className="space-y-8 p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-14 w-48 rounded-2xl" />
        </div>
        <Card className="p-8 rounded-[2rem] border-none shadow-xl">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Subject Management</h1>
          <p className="text-slate-500 font-bold mt-1 text-lg">Add and edit subjects for exams and competitions.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={handleSeed}
            disabled={isSubmitting}
            className="h-14 px-6 rounded-2xl border-2 border-slate-100 font-bold hover:bg-slate-50"
          >
            <RefreshCw className={cn("mr-2 h-5 w-5", isSubmitting && "animate-spin")} />
            Seed Defaults
          </Button>
          <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) {
            setEditingId(null)
            form.reset()
          }
        }}>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-95">
              <Plus className="mr-2 h-6 w-6" />
              Add New Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-[2.5rem] p-10 border-none shadow-2xl">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-black text-slate-900">
                {editingId ? "Edit Subject" : "Create New Subject"}
              </DialogTitle>
              <DialogDescription className="text-lg font-bold text-slate-400">
                Configure subject details.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-black text-slate-400 uppercase tracking-widest">Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mathematics" className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-black text-slate-400 uppercase tracking-widest">Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Primary, Secondary, General" className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50 font-bold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-black text-slate-400 uppercase tracking-widest">Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the subject..." className="min-h-[100px] rounded-xl border-2 border-slate-100 bg-slate-50 font-bold" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg">
                    {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : editingId ? "Update Subject" : "Create Subject"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-black text-slate-400 uppercase tracking-wider py-6 px-8">Subject</TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-wider py-6">Category</TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-wider py-6">Description</TableHead>
              <TableHead className="text-right font-black text-slate-400 uppercase tracking-wider py-6 px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-bold">
                  No subjects found. Add your first subject to get started.
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject) => (
                <TableRow key={subject.id} className="group hover:bg-slate-50/50 border-slate-100 transition-colors">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-black text-slate-900 text-lg">{subject.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 font-bold text-slate-600">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                      {subject.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-6 font-medium text-slate-500 max-w-md truncate">
                    {subject.description}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(subject)} className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                        <Pencil className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.id, subject.name)} className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
