import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function isObjectId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classValue = searchParams.get('class')
    const sectionValue = searchParams.get('section')
    const subjectValue = searchParams.get('subject')

    console.log('=== TEACHER API ===')
    console.log('Input:', { classValue, sectionValue, subjectValue })

    // If NO filters, return all teachers
    if (!classValue && !sectionValue && !subjectValue) {
      const teachers = await prisma.teacher.findMany({
        include: { subject: true },
        orderBy: { name: 'asc' }
      })
      return NextResponse.json(teachers)
    }

    // Build where clause based on what's provided
    const whereClause: any = {}

    if (subjectValue) {
      if (isObjectId(subjectValue)) {
        whereClause.subjectId = subjectValue
      } else {
        const subject = await prisma.subject.findUnique({ where: { name: subjectValue } })
        if (subject) whereClause.subjectId = subject.id
      }
    }

    if (classValue && sectionValue) {
      // Get class and section IDs
      let classId = classValue
      let sectionId = sectionValue

      if (!isObjectId(classValue)) {
        const cls = await prisma.class.findUnique({ where: { name: classValue } })
        classId = cls?.id || ''
      }

      if (!isObjectId(sectionValue)) {
        const sec = await prisma.section.findFirst({ where: { name: sectionValue } })
        sectionId = sec?.id || ''
      }

      if (classId && sectionId) {
        whereClause.assignments = {
          some: {
            classId: classId,
            sectionId: sectionId
          }
        }
      }
    }

    console.log('Where clause:', JSON.stringify(whereClause))

    const teachers = await prisma.teacher.findMany({
      where: whereClause,
      include: {
        subject: true,
        assignments: {
          include: {
            class: true,
            section: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    console.log('Found teachers:', teachers.length)
    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}