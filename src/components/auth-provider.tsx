"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { doc, onSnapshot, Unsubscribe } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { LoadingScreen } from "./ui/loading-screen"
import { useToast } from "./ui/use-toast"

interface UserData {
  uid: string
  email: string | null
  fullName: string
  role: "student" | "teacher" | "admin"
  isNewUser?: boolean
  isOffline?: boolean
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  isAdmin: boolean
  isTeacher: boolean
  isOffline: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  isTeacher: false,
  isOffline: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [snapshotUnsub, setSnapshotUnsub] = useState<Unsubscribe | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const authUnsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsOffline(false)

      // Clean up previous snapshot listener
      if (snapshotUnsub) {
        snapshotUnsub()
        setSnapshotUnsub(null)
      }

      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid)

        const unsub = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data()
              setUserData({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                fullName: data.fullName || firebaseUser.displayName || "User",
                role: (data.role as "student" | "teacher" | "admin") || "student",
                ...data,
              } as UserData)
              setIsOffline(false)
            } else {
              // New user — document not created yet
              setUserData({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                fullName: firebaseUser.displayName || "New User",
                role: "student",
                isNewUser: true,
              } as UserData)
            }
            setLoading(false)
          },
          (error: any) => {
            const msg = error.message || ""
            console.error("onSnapshot error:", msg)

            if (msg.includes("insufficient permissions")) {
              console.warn("HELPFUL HINT: This usually means your Firestore Security Rules are blocking the read. Check your rules in the Firebase Console.")
              toast({
                variant: "destructive",
                title: "Firestore Access Denied",
                description: "Your Security Rules are blocking your account. Go to the Firebase Console -> Firestore -> Rules and allow authenticated reads.",
              })
            }

            if (msg.includes("client is offline")) {
              setIsOffline(true)
              setUserData({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                fullName: firebaseUser.displayName || "Offline User",
                role: "student",
              } as UserData)
              setLoading(false)
            }
          }
        )

        setSnapshotUnsub(() => unsub)
      } else {
        setUserData(null)
        setLoading(false)
      }
    })

    return () => {
      authUnsub()
      if (snapshotUnsub) snapshotUnsub()
    }
  }, [toast])

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isAdmin: userData?.role === "admin",
        isTeacher: userData?.role === "teacher" || userData?.role === "admin",
        isOffline,
      }}
    >
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  )
}