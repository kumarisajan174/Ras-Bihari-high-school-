import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { name, subject, password, classNames, sectionNames } = await request.json()

    console.log('=== CREATE TEACHER ===')
    console.log('Input:', { name, subject, classNames, sectionNames })

    if (!name || !subject || !password || !classNames?.length || !sectionNames?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        subject,
        password,
        assignedClasses: classNames,
        assignedSections: sectionNames
      }
    })

    console.log('Created teacher:', teacher)
    return NextResponse.json(teacher)
  } catch (error) {
    console.error('Error creating teacher:', error)
    return NextResponse.json({ error: 'Error creating teacher' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json({ error: 'Error fetching teachers' }, { status: 500 })
  }
}