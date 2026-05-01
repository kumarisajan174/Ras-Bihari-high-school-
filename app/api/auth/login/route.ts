import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
        assignments: {
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

    console.log('Login successful!')
    return NextResponse.json({
      success: true,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
        assignments: teacher.assignments
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed', details: String(error) }, { status: 500 })
  }
}