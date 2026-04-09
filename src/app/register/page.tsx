"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { GraduationCap, Lock, Mail, User, Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password)
      
      // Update profile
      await updateProfile(user, {
        displayName: values.fullName
      })

      // Create user doc in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: values.fullName,
        email: values.email,
        role: "student",
        createdAt: new Date().toISOString(),
        stats: {
          testsTaken: 0,
          avgScore: 0,
          practiceMode: 0,
          timedExam: 0,
          cbqCompetition: 0
        }
      })

      const idToken = await user.getIdToken()

      // Securely set session cookie via API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      if (!res.ok) throw new Error("Failed to initialize secure session")

      toast({
        title: "Account Created!",
        description: "Welcome to CBT & CBQ. Start your journey today!",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Branding & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col space-y-6"
        >
          <div className="flex items-center space-x-2 text-primary">
            <GraduationCap className="h-10 w-10" />
            <h1 className="text-3xl font-bold tracking-tight">CBT & CBQ</h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Unlock Your Potential with <br />
              <span className="text-accent">Advanced Learning.</span>
            </h2>
            <div className="space-y-4 mt-8">
              {[
                "Real-time Quiz Competitions",
                "Practice Mode with explanations",
                "Timed Exam simulation",
                "Detailed Performance Analytics"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-lg font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-none shadow-2xl shadow-slate-200/50">
            <CardHeader className="space-y-1 pb-6">
              <div className="md:hidden flex items-center space-x-2 text-primary mb-4">
                <GraduationCap className="h-8 w-8" />
                <span className="text-xl font-bold">CBT & CBQ</span>
              </div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>
                Join thousands of students and start practicing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input 
                              placeholder="John Doe" 
                              className="pl-10 h-11 border-slate-200 focus:border-primary transition-all" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input 
                              placeholder="name@example.com" 
                              className="pl-10 h-11 border-slate-200 focus:border-primary transition-all" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10 h-11 border-slate-200 focus:border-primary transition-all" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10 h-11 border-slate-200 focus:border-primary transition-all" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-start space-x-2 pt-2">
                    <input type="checkbox" id="terms" className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" required />
                    <label htmlFor="terms" className="text-sm text-slate-600 leading-tight">
                      By signing up, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold bg-accent hover:bg-accent/90 transition-all hover:scale-[1.01]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create My Account"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-center gap-1 border-t border-slate-100 bg-slate-50/50 py-4 rounded-b-lg">
              <span className="text-sm text-slate-600">Already have an account?</span>
              <Link href="/login" className="text-sm font-bold text-primary hover:underline">
                Sign In
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
