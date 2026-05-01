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

    let classRecord = null
    let sectionRecord = null
    let subjectRecord = null

    if (classValue) {
      if (isObjectId(classValue)) {
        classRecord = await prisma.class.findUnique({ where: { id: classValue } })
      } else {
        classRecord = await prisma.class.findUnique({ where: { name: classValue } })
      }
    }

    if (sectionValue) {
      if (isObjectId(sectionValue)) {
        sectionRecord = await prisma.section.findUnique({ where: { id: sectionValue } })
      } else {
        sectionRecord = await prisma.section.findFirst({ where: { name: sectionValue } })
      }
    }

    if (subjectValue) {
      if (isObjectId(subjectValue)) {
        subjectRecord = await prisma.subject.findUnique({ where: { id: subjectValue } })
      } else {
        subjectRecord = await prisma.subject.findUnique({ where: { name: subjectValue } })
      }
    }

    console.log('Resolved:', { class: classRecord?.name, classId: classRecord?.id, section: sectionRecord?.name, sectionId: sectionRecord?.id, subject: subjectRecord?.name, subjectId: subjectRecord?.id })

    // If NO filters provided, return ALL teachers (for admin/homepage)
    if (!classValue && !sectionValue && !subjectValue) {
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

    // If filters provided but not found, return empty
    if (classValue && !classRecord) {
      console.log('Class not found, returning empty')
      return NextResponse.json([])
    }
    if (sectionValue && !sectionRecord) {
      console.log('Section not found, returning empty')
      return NextResponse.json([])
    }
    if (subjectValue && !subjectRecord) {
      console.log('Subject not found, returning empty')
      return NextResponse.json([])
    }

    // Debug: Find teachers with matching subjectId
    console.log('Finding teachers with subjectId:', subjectRecord.id)
    const teachersBySubject = await prisma.teacher.findMany({
      where: { subjectId: subjectRecord.id }
    })
    console.log('Teachers with matching subjectId:', teachersBySubject.map(t => t.name))

    // Build filter for assignments
    const assignmentFilter: any = {}
    if (classRecord) assignmentFilter.classId = classRecord.id
    if (sectionRecord) assignmentFilter.sectionId = sectionRecord.id

    console.log('Assignment filter:', assignmentFilter)

    // Check assignments directly
    const assignments = await prisma.assignment.findMany({
      where: {
        classId: classRecord?.id,
        sectionId: sectionRecord?.id
      },
      include: { teacher: true }
    })
    console.log('Assignments with class+section:', assignments.map(a => a.teacher?.name))

    // Build teacher where clause
    const teacherWhere: any = {}
    if (subjectRecord) teacherWhere.subjectId = subjectRecord.id
    if (Object.keys(assignmentFilter).length > 0) {
      teacherWhere.assignments = { some: assignmentFilter }
    }

    console.log('Final teacherWhere:', teacherWhere)

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