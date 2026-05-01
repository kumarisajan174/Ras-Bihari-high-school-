import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { class: className, section: sectionName, subject: subjectName } = body

    console.log('=== SIMPLE TEACHER FILTER API ===')
    console.log('Request:', { className, sectionName, subjectName })

    if (!className || !sectionName || !subjectName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Normalize values to uppercase for sections
    const normalizedClass = className.trim()
    const normalizedSection = sectionName.trim().toUpperCase()
    const normalizedSubject = subjectName.trim()

    // Find subject by name (case insensitive)
    const subjectRecord = await prisma.subject.findFirst({
      where: {
        name: { equals: normalizedSubject, mode: 'insensitive' }
      }
    })

    console.log('Subject found:', subjectRecord?.name, subjectRecord?.id)

    if (!subjectRecord) {
      console.log('Subject not found:', normalizedSubject)
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    // Find ALL teachers with matching subject
    const allTeachers = await prisma.teacher.findMany({
      where: { subjectId: subjectRecord.id },
      include: { subject: true }
    })

    console.log('Total teachers with subject:', allTeachers.length)

    // Filter by assignedClasses and assignedSections using simple string matching
    const matchingTeachers = allTeachers.filter(teacher => {
      const hasClass = teacher.assignedClasses?.includes(normalizedClass)
      const hasSection = teacher.assignedSections?.map(s => s.toUpperCase()).includes(normalizedSection)

      console.log(`Teacher ${teacher.name}: class=${hasClass}, section=${hasSection}`)
      console.log(`  assignedClasses: [${teacher.assignedClasses?.join(', ')}]`)
      console.log(`  assignedSections: [${teacher.assignedSections?.join(', ')}]`)

      return hasClass && hasSection
    })

    console.log('Matching teachers:', matchingTeachers.length)
    console.log('Names:', matchingTeachers.map(t => t.name))

    return NextResponse.json(matchingTeachers)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}