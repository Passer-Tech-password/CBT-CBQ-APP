"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
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
        const maxAttempts = 3
        const timeoutMs = 5000 // 5 seconds timeout

        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, "users", user.uid)
            
            // Timeout mechanism using Promise.race
            const userDoc = await Promise.race([
              getDoc(userDocRef),
              new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error("Firestore fetch timeout")), timeoutMs)
              )
            ])
            
            if (userDoc.exists()) {
              setUserData(userDoc.data() as UserData)
              return true
            } else {
              console.warn("User document not found in Firestore for uid:", user.uid)
              setUserData(null)
              return true
            }
          } catch (error) {
            console.error(`Error fetching user data (Attempt ${attempts + 1}/${maxAttempts}):`, error)
            return false
          }
        }

        while (attempts < maxAttempts) {
          const success = await fetchUserData()
          if (success) break
          attempts++
          if (attempts < maxAttempts) {
            // Wait before retry (exponential backoff could be added here)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
          }
        }

        if (attempts === maxAttempts) {
          console.error("Max retry attempts reached for Firestore fetch.")
          setUserData(null)
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
