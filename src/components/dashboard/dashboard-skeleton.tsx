import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-8 animate-in fade-in duration-500">
      <div className="h-24 bg-white border-b mb-8" />
      
      <main className="container px-4 md:px-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-12 w-40 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-[2rem]" />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-[220px] rounded-[2rem]" />
          <Skeleton className="h-[220px] rounded-[2rem]" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-[2rem]" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
