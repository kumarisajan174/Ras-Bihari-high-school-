import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json()

    console.log('=== TEACHER LOGIN ===')
    console.log('Input:', { name, password })

    if (!name || !password) {
      return NextResponse.json({ error: 'Name and password required' }, { status: 400 })
    }

    const teacher = await prisma.teacher.findFirst({
      where: {
        name: name,
        password: password
      }
    })

    if (!teacher) {
      console.log('Login failed: Invalid credentials')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Set teacher cookie with lax sameSite for proper cookie detection
    cookies().set("teacher_token", "logged_in", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    console.log('Login successful:', teacher)
    return NextResponse.json({
      id: teacher.id,
      name: teacher.name,
      subject: teacher.subject,
      assignedClasses: teacher.assignedClasses,
      assignedSections: teacher.assignedSections
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login error' }, { status: 500 })
  }
}
