import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-in fade-in duration-500">
      {/* Skeleton Navbar */}
      <div className="h-24 bg-white border-b mb-10 flex items-center px-8 justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
        <div className="flex items-center space-x-6">
          <Skeleton className="h-6 w-24 hidden md:block" />
          <Skeleton className="h-6 w-24 hidden md:block" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
      
      <main className="container px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-12 w-64 rounded-2xl" />
            <Skeleton className="h-6 w-96 rounded-xl" />
          </div>
          <Skeleton className="h-14 w-48 rounded-2xl" />
        </section>

        {/* Stats Grid Skeleton */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 space-y-6">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-16" />
              </div>
            </Card>
          ))}
        </section>

        {/* Charts Section Skeleton */}
        <section className="grid lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
            <div className="flex justify-between mb-10">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <Skeleton className="h-[350px] w-full rounded-[2rem]" />
          </Card>
          <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10 space-y-8">
            <Skeleton className="h-8 w-40" />
            <div className="flex justify-center py-10">
              <Skeleton className="h-56 w-56 rounded-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </Card>
        </section>

        {/* Subject Grid Skeleton */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-56 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-8 space-y-6">
                <div className="flex justify-between">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="pt-4 flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
