import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const sectionId = searchParams.get('sectionId')
    const subjectId = searchParams.get('subjectId')

    // If no filters provided, return empty array (teachers must be filtered)
    if (!classId && !sectionId && !subjectId) {
      return NextResponse.json([])
    }

    // Build where clause based on filters
    const whereClause: any = {}

    // Filter by subject
    if (subjectId) {
      whereClause.subjectId = subjectId
    }

    // Filter by class and section through TeacherAssignment
    if (classId || sectionId) {
      whereClause.assignments = {}

      if (classId) {
        whereClause.assignments.classId = classId
      }

      if (sectionId) {
        whereClause.assignments.sectionId = sectionId
      }
    }

    const teachers = await prisma.teacher.findMany({
      where: whereClause,
      include: {
        subject: true,
        assignments: {
          where: {
            ...(classId && { classId }),
            ...(sectionId && { sectionId })
          },
          include: {
            class: true,
            section: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching teachers' }, { status: 500 })
  }
}