"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { doc, getDoc, getDocFromCache } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { LoadingScreen } from "./ui/loading-screen"

interface UserData {
  uid: string
  email: string | null
  fullName: string
  role: "student" | "admin"
  isNewUser?: boolean
  isOffline?: boolean
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  isAdmin: boolean
  isOffline?: boolean   // ← New: useful for UI feedback
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  isOffline: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setIsOffline(false)

      if (firebaseUser) {
        await fetchUserDataWithRetry(firebaseUser)
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const fetchUserDataWithRetry = async (firebaseUser: User) => {
    const maxAttempts = 3
    let lastError: any = null

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid)

        let userDoc

        // First attempt: Try cache only (fastest)
        if (attempt === 0) {
          try {
            userDoc = await getDocFromCache(userDocRef)
          } catch (cacheErr: any) {
            if (cacheErr.message?.includes("Failed to get document from cache")) {
              // Cache miss → continue to normal getDoc
              userDoc = null
            } else {
              throw cacheErr
            }
          }
        }

        // Default / subsequent attempts: Use normal getDoc (cache → server)
        if (!userDoc) {
          userDoc = await getDoc(userDocRef)
        }

        if (userDoc.exists()) {
          const data = userDoc.data()

          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: data.fullName || firebaseUser.displayName || "User",
            role: (data.role as "student" | "admin") || "student",
            ...data,
          } as UserData)

          setIsOffline(false)
          return // Success
        } else {
          // Document doesn't exist yet (common right after signup)
          if (attempt === maxAttempts - 1) {
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName || "New User",
              role: "student",
              isNewUser: true,
            } as UserData)
          }
        }
      } catch (error: any) {
        lastError = error
        const errorMsg = error.message || "Unknown error"

        console.error(`Error fetching user data (Attempt ${attempt + 1}/${maxAttempts}):`, errorMsg)

        // === Handle offline specifically ===
        if (errorMsg.includes("Failed to get document because the client is offline")) {
          console.warn("Client is offline → using fallback user data")
          setIsOffline(true)

          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || "User (Offline)",
            role: "student",
            isOffline: true,
          } as UserData)

          return // No need to retry when clearly offline
        }

        // For other errors, continue retrying (with backoff)
      }

      // Exponential backoff before next retry
      if (attempt < maxAttempts - 1) {
        const delay = 700 * Math.pow(1.6, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    // If we reach here after all attempts and still no data
    if (!userData) {
      console.error("Max retry attempts reached for user data fetch.")
      setUserData({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        fullName: firebaseUser.displayName || "User",
        role: "student",
        isOffline: true,
      } as UserData)
      setIsOffline(true)
    }
  }

  const value = {
    user,
    userData,
    loading,
    isAdmin: userData?.role === "admin",
    isOffline: isOffline || userData?.isOffline === true,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  )
}