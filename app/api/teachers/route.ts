import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class')
    const sectionName = searchParams.get('section')
    const subjectName = searchParams.get('subject')

    console.log('=== TEACHER API ===')
    console.log('Looking for:', { className, sectionName, subjectName })

    // If NO filters provided, return ALL teachers (for admin/homepage)
    if (!className && !sectionName && !subjectName) {
      console.log('No filters, returning all teachers')
      const allTeachers = await prisma.teacher.findMany({
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
      return NextResponse.json(allTeachers)
    }

    // Resolve names to IDs - use findFirst since Section.name is not @unique
    const classRecord = className ? await prisma.class.findUnique({ where: { name: className } }) : null
    const sectionRecord = sectionName ? await prisma.section.findFirst({ where: { name: sectionName } }) : null
    const subjectRecord = subjectName ? await prisma.subject.findUnique({ where: { name: subjectName } }) : null

    console.log('Resolved:', { class: classRecord, section: sectionRecord, subject: subjectRecord })

    // If ANY filter is provided but not found, return empty
    if (className && !classRecord) {
      console.log('Class not found, returning empty')
      return NextResponse.json([])
    }
    if (sectionName && !sectionRecord) {
      console.log('Section not found, returning empty')
      return NextResponse.json([])
    }
    if (subjectName && !subjectRecord) {
      console.log('Subject not found, returning empty')
      return NextResponse.json([])
    }

    // Build filter for assignments
    const assignmentFilter: any = {}
    if (classRecord) assignmentFilter.classId = classRecord.id
    if (sectionRecord) assignmentFilter.sectionId = sectionRecord.id

    // Build teacher where clause
    const teacherWhere: any = {}
    if (subjectRecord) teacherWhere.subjectId = subjectRecord.id
    if (Object.keys(assignmentFilter).length > 0) {
      teacherWhere.assignments = { some: assignmentFilter }
    }

    const teachers = await prisma.teacher.findMany({
      where: teacherWhere,
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