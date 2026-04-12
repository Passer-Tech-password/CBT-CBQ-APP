import { NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    const auth = adminAuth()
    const db = adminDb()

    if (!auth || !db) {
      return NextResponse.json({ error: "Firebase Admin not initialized" }, { status: 500 })
    }

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // Get user role from Firestore (server-side)
    const userDoc = await db.collection("users").doc(uid).get()
    const userData = userDoc.data()
    const role = userData?.role || "student"

    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })

    const response = NextResponse.json({ status: "success", role })

    // Set the session cookie as HttpOnly and Secure
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    })

    // Also set the role in a non-HttpOnly cookie for client-side UI logic (but not for security)
    response.cookies.set("user-role", role, {
      maxAge: expiresIn / 1000,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    })

    return response
  } catch (error: any) {
    console.error("Auth API Error:", error)
    // Return the actual error message to help debugging
    return NextResponse.json(
      { error: error.message || "Unauthorized" }, 
      { status: error.code === 5 ? 404 : 401 }
    )
  }
}
