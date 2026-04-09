"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight,
  MoreVertical,
  Pencil,
  Trash2,
  BookOpen
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const competitionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subject: z.string().min(1, "Please select a subject"),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.string().min(1, "Duration is required"),
  maxParticipants: z.string().optional(),
})

type CompetitionFormValues = z.infer<typeof competitionSchema>

const MOCK_COMPETITIONS = [
  { id: "1", title: "National Math Challenge 2026", subject: "Mathematics", startTime: "2026-04-15T10:00", participants: 1240, status: "Upcoming" },
  { id: "2", title: "Biology Olympiad Round 1", subject: "Biology", startTime: "2026-04-10T14:30", participants: 850, status: "Upcoming" },
  { id: "3", title: "Weekly Science Quiz", subject: "Physics", startTime: "2026-04-01T16:00", participants: 420, status: "Live" },
]

export default function CompetitionsManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionSchema),
    defaultValues: {
      title: "",
      subject: "",
      startTime: "",
      duration: "60",
      maxParticipants: "1000",
    }
  })

  const onSubmit = async (data: CompetitionFormValues) => {
    // In a real app, this would call Firebase
    console.log(data)
    toast({
      title: "Competition Created",
      description: "The new competition has been successfully scheduled.",
    })
    setIsModalOpen(false)
    form.reset()
  }

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Competitions</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">Schedule and manage live quiz events.</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20">
                <Plus className="mr-2 h-6 w-6" />
                Schedule Competition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2.5rem] p-10 border-none shadow-2xl">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-black text-slate-900">New Competition</DialogTitle>
                <DialogDescription className="text-lg font-bold text-slate-400">Set up a live competitive event for students.</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">Competition Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. National Math Challenge" className="h-12 rounded-xl border-2 font-bold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-2 font-bold">
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">Duration (Mins)</FormLabel>
                          <FormControl>
                            <Input type="number" className="h-12 rounded-xl border-2 font-bold" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">Start Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" className="h-12 rounded-xl border-2 font-bold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-6">
                    <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20">
                      Create Competition
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MOCK_COMPETITIONS.map((comp, idx) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden group">
                <div className={cn(
                  "h-2 w-full",
                  comp.status === "Live" ? "bg-red-500 animate-pulse" : "bg-primary"
                )} />
                <CardHeader className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      comp.status === "Live" ? "bg-red-50 text-red-500" : "bg-blue-50 text-primary"
                    )}>
                      {comp.status}
                    </div>
                    <div className="flex items-center text-slate-400 text-xs font-bold">
                      <Users className="h-4 w-4 mr-1.5" />
                      {comp.participants}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                    {comp.title}
                  </CardTitle>
                  <CardDescription className="font-bold text-slate-400 mt-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {comp.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <div className="flex items-center text-slate-600 font-black text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      {format(new Date(comp.startTime), "MMM d, HH:mm")}
                    </div>
                    <div className="flex items-center text-slate-600 font-black text-sm">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      60m
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-600 font-black hover:bg-primary hover:text-white transition-all">
                      Manage
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
