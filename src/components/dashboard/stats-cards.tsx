"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, CheckCircle2, Trophy, Clock, Target } from "lucide-react"
import { motion } from "framer-motion"

interface StatsCardsProps {
  stats?: {
    testsTaken: number;
    avgScore: number;
    practiceMode: number;
    timedExam: number;
    cbqCompetition: number;
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Tests Taken",
      value: stats?.testsTaken || 0,
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-blue-50",
      description: "Keep going, you're doing great!"
    },
    {
      title: "Avg Score",
      value: `${stats?.avgScore || 84}%`,
      icon: Trophy,
      color: "text-accent", // Emerald Green
      bg: "bg-emerald-50",
      description: "Top 10% of your class"
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <Card className="border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">
                {card.title}
              </CardTitle>
              <div className={`p-3 rounded-2xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pb-8">
              <div className="text-5xl font-black text-slate-900 tracking-tight">{card.value}</div>
              <p className="text-sm font-bold text-slate-500 mt-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-accent" />
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
