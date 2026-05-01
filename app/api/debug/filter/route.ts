import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { class: className, section: sectionName, subject: subjectName } = body

    console.log('=== DEBUG FILTER API ===')
    console.log('Request:', { className, sectionName, subjectName })

    // Find records
    const classRecord = await prisma.class.findUnique({ where: { name: className } })
    const sectionRecord = await prisma.section.findFirst({ where: { name: { equals: sectionName, mode: 'insensitive' } } })
    const subjectRecord = await prisma.subject.findFirst({ where: { name: { equals: subjectName, mode: 'insensitive' } } })

    console.log('Class found:', classRecord)
    console.log('Section found:', sectionRecord)
    console.log('Subject found:', subjectRecord)

    if (!classRecord || !sectionRecord || !subjectRecord) {
      return NextResponse.json({
        error: 'Record not found',
        classFound: !!classRecord,
        sectionFound: !!sectionRecord,
        subjectFound: !!subjectRecord,
        className,
        sectionName,
        subjectName
      })
    }

    // Get ALL teachers first (no filter)
    const allTeachers = await prisma.teacher.findMany({
      include: { subject: true, assignments: { include: { class: true, section: true } } }
    })

    console.log('Total teachers in DB:', allTeachers.length)

    // Check each teacher's assignments
    const debugInfo = allTeachers.map(t => {
      const matchingAssignments = t.assignments.filter(a =>
        a.classId === classRecord.id && a.sectionId === sectionRecord.id
      )
      return {
        name: t.name,
        subjectId: t.subjectId,
        subjectName: t.subject?.name,
        assignments: t.assignments.map(a => ({
          classId: a.classId,
          className: a.class?.name,
          sectionId: a.sectionId,
          sectionName: a.section?.name
        })),
        matchesClassAndSection: matchingAssignments.length > 0
      }
    })

    console.log('Debug info:', JSON.stringify(debugInfo, null, 2))

    // Now filtered query
    const filteredTeachers = await prisma.teacher.findMany({
      where: {
        subjectId: subjectRecord.id,
        assignments: {
          some: {
            classId: classRecord.id,
            sectionId: sectionRecord.id
          }
        }
      },
      include: { subject: true, assignments: { include: { class: true, section: true } } }
    })

    return NextResponse.json({
      request: { className, sectionName, subjectName },
      resolved: {
        class: { id: classRecord.id, name: classRecord.name },
        section: { id: sectionRecord.id, name: sectionRecord.name },
        subject: { id: subjectRecord.id, name: subjectRecord.name }
      },
      totalTeachersInDb: allTeachers.length,
      filteredTeachersCount: filteredTeachers.length,
      filteredTeacherNames: filteredTeachers.map(t => t.name),
      debugInfo
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}