import { NextResponse } from 'next/server'
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Delete teacher cookie
    cookies().delete("teacher_token");
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Teacher logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
