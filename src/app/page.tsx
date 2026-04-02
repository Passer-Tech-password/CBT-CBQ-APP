"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, isConfigValid } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Loader2 } from "lucide-react"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isConfigValid || !auth) {
      // If config is invalid, we'll stay on this page to show the error
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  if (!isConfigValid || !auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4 text-center">
        <div className="max-w-md space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-800 mb-2">Firebase Configuration Required</h2>
            <p className="text-amber-700 mb-4">
              It seems you haven't set up your Firebase credentials yet. Please update the <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code> file with your actual API keys.
            </p>
            <div className="text-left bg-white p-3 rounded border border-amber-100 text-xs font-mono overflow-auto max-h-40">
              NEXT_PUBLIC_FIREBASE_API_KEY=your_key<br/>
              NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...<br/>
              ...
            </div>
          </div>
          <p className="text-slate-500 text-sm">
            Restart the development server after updating your environment variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-slate-600 animate-pulse">
          Loading CBT & CBQ...
        </p>
      </div>
    </div>
  )
}
