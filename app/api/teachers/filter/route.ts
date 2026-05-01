import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { class: className, section: sectionName, subject: subjectName } = body

    console.log('=== TEACHER FILTER API ===')
    console.log('Request body:', { className, sectionName, subjectName })

    if (!className || !sectionName || !subjectName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find class
    const classRecord = await prisma.class.findUnique({
      where: { name: className }
    })

    // Find section (case-insensitive)
    const sectionRecord = await prisma.section.findFirst({
      where: { name: { equals: sectionName, mode: 'insensitive' } }
    })

    // Find subject (case-insensitive)
    const subjectRecord = await prisma.subject.findFirst({
      where: { name: { equals: subjectName, mode: 'insensitive' } }
    })

    console.log('Resolved records:', {
      class: classRecord?.name,
      classId: classRecord?.id,
      section: sectionRecord?.name,
      sectionId: sectionRecord?.id,
      subject: subjectRecord?.name,
      subjectId: subjectRecord?.id
    })

    if (!classRecord) {
      console.log('Class not found:', className)
      return NextResponse.json([], { status: 200 })
    }
    if (!sectionRecord) {
      console.log('Section not found:', sectionName)
      return NextResponse.json([], { status: 200 })
    }
    if (!subjectRecord) {
      console.log('Subject not found:', subjectName)
      return NextResponse.json([], { status: 200 })
    }

    // Find teachers matching ALL criteria
    const teachers = await prisma.teacher.findMany({
      where: {
        subjectId: subjectRecord.id,
        assignments: {
          some: {
            classId: classRecord.id,
            sectionId: sectionRecord.id
          }
        }
      },
      include: {
        subject: true,
        assignments: {
          where: {
            classId: classRecord.id,
            sectionId: sectionRecord.id
          },
          include: {
            class: true,
            section: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    console.log('Found teachers:', teachers.length)
    console.log('Teacher names:', teachers.map(t => t.name))

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}