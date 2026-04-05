"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? navigator.onLine : true)
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  const syncPendingResults = useCallback(async () => {
    const pending = JSON.parse(localStorage.getItem("pending_results") || "[]")
    if (pending.length === 0) return

    setIsSyncing(true)
    toast({
      title: "Syncing Data",
      description: `Synchronizing ${pending.length} pending result(s) with the cloud...`,
    })

    let successCount = 0
    const failedResults = []

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
        console.error("Sync failed for result:", result.id, error)
        failedResults.push(result)
      }
    }

    localStorage.setItem("pending_results", JSON.stringify(failedResults))
    setIsSyncing(false)

    if (successCount > 0) {
      toast({ 
        title: "Sync Complete", 
        description: `Successfully uploaded ${successCount} result(s). Your dashboard is now up to date.`,
      })
    }

    if (failedResults.length > 0) {
      toast({
        variant: "destructive",
        title: "Partial Sync",
        description: `${failedResults.length} result(s) could not be synced. We'll try again later.`,
      })
    }
  }, [toast])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingResults()
    }
    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "Offline Mode",
        description: "You're currently offline. Test results will be saved locally.",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Initial sync check
    if (navigator.onLine) {
      syncPendingResults()
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [syncPendingResults, toast])

  const saveResult = async (result: any) => {
    if (typeof window === "undefined") return

    // Prevent duplicate submissions by checking if this test unique ID was already handled
    const submittedTests = JSON.parse(localStorage.getItem("submitted_tests") || "[]")
    const testKey = `${result.subject}_${result.mode}_${result.timestamp || Date.now()}`
    
    if (submittedTests.includes(testKey)) {
      toast({
        variant: "destructive",
        title: "Duplicate Submission",
        description: "This test result has already been submitted.",
      })
      return
    }

    const resultWithMeta = {
      ...result,
      userId: auth.currentUser?.uid,
      timestamp: Date.now(),
    }

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, "results"), {
          ...resultWithMeta,
          timestamp: serverTimestamp(),
        })
        
        // Mark as submitted
        submittedTests.push(testKey)
        localStorage.setItem("submitted_tests", JSON.stringify(submittedTests.slice(-20))) // Keep last 20

        toast({ title: "Result Saved", description: "Successfully synced to cloud." })
      } catch (error) {
        console.error("Online save failed, falling back to local:", error)
        saveToLocal(resultWithMeta, testKey)
      }
    } else {
      saveToLocal(resultWithMeta, testKey)
    }
  }

  const saveToLocal = (result: any, testKey: string) => {
    try {
      const pending = JSON.parse(localStorage.getItem("pending_results") || "[]")
      pending.push({ ...result, id: `local_${Date.now()}` })
      localStorage.setItem("pending_results", JSON.stringify(pending))
      
      const submittedTests = JSON.parse(localStorage.getItem("submitted_tests") || "[]")
      submittedTests.push(testKey)
      localStorage.setItem("submitted_tests", JSON.stringify(submittedTests.slice(-20)))

      toast({ 
        title: "Offline Save", 
        description: "Result stored on device. Syncing will occur automatically when online.",
      })
    } catch (e) {
      console.error("Local storage save failed:", e)
      toast({
        variant: "destructive",
        title: "Storage Error",
        description: "Could not save result locally. Please check your browser storage settings.",
      })
    }
  }

  return { isOnline, isSyncing, saveResult, syncPendingResults }
}
