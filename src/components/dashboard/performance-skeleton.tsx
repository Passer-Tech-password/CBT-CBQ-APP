import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function PerformanceSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans animate-in fade-in duration-500">
      <div className="h-24 bg-white border-b mb-8" />
      
      <main className="container px-4 md:px-8 py-10 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-96" />
            <Skeleton className="h-6 w-80" />
          </div>
          <Skeleton className="h-14 w-40 rounded-2xl" />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-xl bg-white rounded-[2rem] p-8 space-y-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {[1, 2].map((i) => (
            <Card key={i} className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-[350px] w-full rounded-2xl" />
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {[1, 2].map((i) => (
            <Card key={i} className="border-none shadow-xl bg-white rounded-[2.5rem] p-10 space-y-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-12 w-32 rounded-2xl" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
