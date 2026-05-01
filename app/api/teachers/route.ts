import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class')
    const sectionName = searchParams.get('section')
    const subjectName = searchParams.get('subject')

    // If no filters provided, return empty array
    if (!className && !sectionName && !subjectName) {
      return NextResponse.json([])
    }

    // Resolve names to IDs
    let classId: string | undefined
    let sectionId: string | undefined
    let subjectId: string | undefined

    if (className) {
      const cls = await prisma.class.findUnique({ where: { name: className } })
      classId = cls?.id
    }

    if (sectionName) {
      const section = await prisma.section.findUnique({ where: { name: sectionName } })
      sectionId = section?.id
    }

    if (subjectName) {
      const subject = await prisma.subject.findUnique({ where: { name: subjectName } })
      subjectId = subject?.id
    }

    // Build where clause
    const whereClause: any = {}

    // Filter by subject
    if (subjectId) {
      whereClause.subjectId = subjectId
    }

    // Filter by assignments (class AND section match)
    if (classId || sectionId) {
      const assignmentFilter: any = {}
      if (classId) assignmentFilter.classId = classId
      if (sectionId) assignmentFilter.sectionId = sectionId

      whereClause.assignments = {
        some: assignmentFilter
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