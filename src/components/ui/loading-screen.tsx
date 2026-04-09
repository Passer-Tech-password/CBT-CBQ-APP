"use client"

import { GraduationCap, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="flex items-center justify-center h-24 w-24 rounded-2xl bg-primary/10 text-primary shadow-xl shadow-primary/5"
          >
            <GraduationCap className="h-12 w-12" />
          </motion.div>
          
          <div className="absolute -bottom-2 -right-2">
            <div className="bg-white dark:bg-slate-950 p-1 rounded-full">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            CBT & CBQ
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
            Loading your experience...
          </p>
        </div>
      </motion.div>
    </div>
  )
}
