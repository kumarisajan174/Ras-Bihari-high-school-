import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const sectionId = searchParams.get('sectionId')
    const subjectId = searchParams.get('subjectId')

    // If no filters provided, return empty array
    if (!classId && !sectionId && !subjectId) {
      return NextResponse.json([])
    }

    // Build the assignments filter for class AND section
    const assignmentsFilter: any = {}
    if (classId) assignmentsFilter.classId = classId
    if (sectionId) assignmentsFilter.sectionId = sectionId

    // Build where clause
    const whereClause: any = {}

    // Filter by subject
    if (subjectId) {
      whereClause.subjectId = subjectId
    }

    // Filter by assignments (class AND section match)
    if (Object.keys(assignmentsFilter).length > 0) {
      whereClause.assignments = {
        some: assignmentsFilter
      }
    }

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

    return NextResponse.json(teachers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching teachers' }, { status: 500 })
  }
}