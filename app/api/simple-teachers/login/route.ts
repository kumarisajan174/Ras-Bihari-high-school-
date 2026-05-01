import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

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