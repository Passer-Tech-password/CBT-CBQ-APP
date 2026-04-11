import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function PerformanceSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans animate-in fade-in duration-500">
      {/* Skeleton Navbar */}
      <div className="h-24 bg-white border-b mb-10 flex items-center px-8 justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
        <div className="flex items-center space-x-6">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
      
      <main className="container px-4 md:px-8 py-10 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="h-14 w-[500px] rounded-2xl" />
            <Skeleton className="h-6 w-[400px] rounded-xl" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-14 w-40 rounded-2xl" />
            <Skeleton className="h-14 w-40 rounded-2xl" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 space-y-6">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {[1, 2].map((i) => (
            <Card key={i} className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
              <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {[1, 2].map((i) => (
            <Card key={i} className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[3rem] p-10 space-y-8">
              <div className="flex items-center space-x-6">
                <Skeleton className="h-20 w-20 rounded-[1.5rem]" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
