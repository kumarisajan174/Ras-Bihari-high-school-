import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classValue = searchParams.get('class')
    const sectionValue = searchParams.get('section')
    const subjectValue = searchParams.get('subject')

    console.log('=== FILTER TEACHERS API ===')
    console.log('Input:', { classValue, sectionValue, subjectValue })

    // Fetch ALL teachers
    const allTeachers = await prisma.teacher.findMany({
      orderBy: { name: 'asc' }
    })

    console.log('ALL TEACHERS:', JSON.stringify(allTeachers, null, 2))

    // If NO filters, return all
    if (!classValue && !sectionValue && !subjectValue) {
      console.log('No filters provided, returning all teachers')
      return NextResponse.json(allTeachers)
    }

    // Manual JavaScript filtering - SIMPLE string matching
    const filteredTeachers = allTeachers.filter((teacher) => {
      const subjectMatch = teacher.subject?.trim().toLowerCase() === subjectValue?.trim().toLowerCase()
      const classMatch = teacher.assignedClasses?.includes(classValue)
      const sectionMatch = teacher.assignedSections?.includes(sectionValue)

      console.log(`\nTeacher: ${teacher.name}`)
      console.log(`  subject: "${teacher.subject}" vs "${subjectValue}" => ${subjectMatch}`)
      console.log(`  classes: ${JSON.stringify(teacher.assignedClasses)} includes "${classValue}" => ${classMatch}`)
      console.log(`  sections: ${JSON.stringify(teacher.assignedSections)} includes "${sectionValue}" => ${sectionMatch}`)
      console.log(`  FINAL: ${subjectMatch && classMatch && sectionMatch}`)

      return subjectMatch && classMatch && sectionMatch
    })

    console.log('\n=== FILTERED TEACHERS ===')
    console.log('Filtered count:', filteredTeachers.length)
    console.log(JSON.stringify(filteredTeachers, null, 2))

    return NextResponse.json(filteredTeachers)
  } catch (error) {
    console.error('Error filtering teachers:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}