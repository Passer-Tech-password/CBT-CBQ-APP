"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { doc, getDoc, getDocFromCache, getDocFromServer } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { LoadingScreen } from "./ui/loading-screen"

interface UserData {
  uid: string
  email: string | null
  fullName: string
  role: "student" | "admin"
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        let attempts = 0
        const maxAttempts = 5 // Increased attempts
        const timeoutMs = 15000 // Increased timeout to 15 seconds for slow networks

        const fetchUserData = async (currentAttempt: number) => {
          try {
            const userDocRef = doc(db, "users", user.uid)
            
            // First try to get from server with a short timeout
            let userDoc;
            try {
              userDoc = await Promise.race([
                getDoc(userDocRef),
                new Promise<never>((_, reject) => 
                  setTimeout(() => reject(new Error("Firestore fetch timeout")), timeoutMs)
                )
              ])
            } catch (err: any) {
              // If server fetch fails (timeout or offline), try cache
              console.warn("Server fetch failed, trying cache:", err.message)
              try {
                userDoc = await getDocFromCache(userDocRef)
              } catch (cacheErr: any) {
                // If cache also fails, we'll throw and retry
                throw cacheErr // Re-throw the cache error to preserve accurate error context
              }
            }
            
            if (userDoc && userDoc.exists()) {
              const data = userDoc.data()
              setUserData({
                uid: user.uid,
                email: user.email,
                fullName: data.fullName || user.displayName || "User",
                role: data.role || "student",
                ...data
              } as UserData)
              return true
            } else {
              // Handle case where user exists in Auth but not in Firestore yet
              console.warn("User document not found in Firestore. Creating fallback or retrying...")
              if (currentAttempt === maxAttempts - 1) {
                // Last attempt: provide a fallback so the app doesn't break
                setUserData({
                  uid: user.uid,
                  email: user.email,
                  fullName: user.displayName || "New User",
                  role: "student",
                  isNewUser: true
                } as UserData)
                return true
              }
              return false // Retry
            }
          } catch (error: any) {
            const errorMessage = error.message || "Unknown error"
            console.error(`Error fetching user data (Attempt ${currentAttempt + 1}/${maxAttempts}):`, errorMessage)
            
            if (currentAttempt === maxAttempts - 1) {
              // Final attempt failed with an error: provide a fallback
              console.warn("Final attempt failed with error. Applying fallback user data.")
              setUserData({
                uid: user.uid,
                email: user.email,
                fullName: user.displayName || "User (Offline)",
                role: "student",
                isOffline: true
              } as UserData)
              return true
            }
            
            return false
          }
        }

        while (attempts < maxAttempts) {
          const success = await fetchUserData(attempts)
          if (success) break
          attempts++
          if (attempts < maxAttempts) {
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)))
          }
        }

        if (attempts === maxAttempts && !userData) {
          console.error("Max retry attempts reached for Firestore fetch.")
          // Don't set to null if we already have a fallback
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    userData,
    loading,
    isAdmin: userData?.role === "admin",
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  )
}
