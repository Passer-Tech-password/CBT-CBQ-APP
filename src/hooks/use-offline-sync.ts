"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? navigator.onLine : true)
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingResults()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const saveResult = async (result: any) => {
    if (typeof window === "undefined") return

    const resultWithMeta = {
      ...result,
      userId: auth.currentUser?.uid,
      timestamp: Date.now(), // Use local timestamp for offline consistency
    }

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, "results"), {
          ...resultWithMeta,
          timestamp: serverTimestamp(),
        })
        toast({ title: "Result Saved", description: "Successfully synced to cloud." })
      } catch (error) {
        console.error("Online save failed, falling back to local:", error)
        saveToLocal(resultWithMeta)
      }
    } else {
      saveToLocal(resultWithMeta)
    }
  }

  const saveToLocal = (result: any) => {
    try {
      const pending = JSON.parse(localStorage.getItem("pending_results") || "[]")
      pending.push({ ...result, id: `local_${Date.now()}` })
      localStorage.setItem("pending_results", JSON.stringify(pending))
      toast({ 
        title: "Offline Mode", 
        description: "Result saved locally. It will sync once you're online.",
      })
    } catch (e) {
      console.error("Local storage save failed:", e)
      toast({
        variant: "destructive",
        title: "Storage Error",
        description: "Could not save result locally. Check storage permissions.",
      })
    }
  }

  const syncPendingResults = async () => {
    const pending = JSON.parse(localStorage.getItem("pending_results") || "[]")
    if (pending.length === 0) return

    setIsSyncing(true)
    let successCount = 0

    for (const result of pending) {
      try {
        const { id, ...resultData } = result
        await addDoc(collection(db, "results"), {
          ...resultData,
          userId: auth.currentUser?.uid,
          timestamp: serverTimestamp(),
          syncedAt: serverTimestamp(),
        })
        successCount++
      } catch (error) {
        console.error("Sync failed for result:", result.id)
      }
    }

    if (successCount > 0) {
      const remaining = pending.slice(successCount)
      localStorage.setItem("pending_results", JSON.stringify(remaining))
      toast({ 
        title: "Sync Complete", 
        description: `Successfully synced ${successCount} pending result(s).`,
      })
    }
    setIsSyncing(false)
  }

  return { isOnline, isSyncing, saveResult, syncPendingResults }
}
