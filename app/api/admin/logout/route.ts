import { NextResponse } from 'next/server'
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Delete admin cookie
    cookies().delete("admin_token");
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
