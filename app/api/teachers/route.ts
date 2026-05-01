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

    // Resolve names to IDs - use findFirst since Section.name is not @unique
    const classRecord = className ? await prisma.class.findUnique({ where: { name: className } }) : null
    const sectionRecord = sectionName ? await prisma.section.findFirst({ where: { name: sectionName } }) : null
    const subjectRecord = subjectName ? await prisma.subject.findUnique({ where: { name: subjectName } }) : null

    console.log('Resolved:', { class: classRecord, section: sectionRecord, subject: subjectRecord })

    if (!classRecord || !sectionRecord || !subjectRecord) {
      console.log('Missing records, returning empty')
      return NextResponse.json([])
    }

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
    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}