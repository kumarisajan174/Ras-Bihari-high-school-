import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ message: 'Login API is working!' })
}

export async function POST(request: Request) {
  try {
    console.log('Login request received')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { teacherId, password } = body
    
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        posts: {
          include: {
            class: true,
            section: true
          }
        }
      }
    })

    console.log('Found teacher:', teacher ? teacher.name : 'NOT FOUND')

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    if (teacher.password !== password) {
      console.log('Password mismatch:', teacher.password, 'vs', password)
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    // Set teacher cookie with lax sameSite for proper cookie detection
    cookies().set("teacher_token", "logged_in", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    console.log('Login successful!')
    return NextResponse.json({
      success: true,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
        posts: teacher.posts
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed', details: String(error) }, { status: 500 })
  }
}
