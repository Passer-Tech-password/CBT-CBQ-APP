import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ status: "success" })
  
  // Clear auth cookies
  response.cookies.delete("session")
  response.cookies.delete("user-role")
  response.cookies.delete("auth-token") // For cleanup of old cookies
  
  return response
}
