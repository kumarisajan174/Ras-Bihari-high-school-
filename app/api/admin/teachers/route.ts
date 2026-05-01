import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: { subject: true },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(teachers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching teachers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, subjectId, password, assignedClasses, assignedSections } = await request.json()

    console.log('Creating teacher:', { name, subjectId, assignedClasses, assignedSections })

    // Normalize: uppercase sections, trim classes
    const normalizedClasses = (assignedClasses || []).map((c: string) => c.trim())
    const normalizedSections = (assignedSections || []).map((s: string) => s.trim().toUpperCase())

    const teacher = await prisma.teacher.create({
      data: {
        name,
        subjectId,
        password,
        assignedClasses: normalizedClasses,
        assignedSections: normalizedSections
      }
    })

    console.log('Teacher created:', teacher)
    return NextResponse.json(teacher)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating teacher' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, subjectId, password, assignedClasses, assignedSections } = await request.json()

    console.log('Updating teacher:', { id, name, subjectId, assignedClasses, assignedSections })

    const normalizedClasses = (assignedClasses || []).map((c: string) => c.trim())
    const normalizedSections = (assignedSections || []).map((s: string) => s.trim().toUpperCase())

    await prisma.teacher.update({
      where: { id },
      data: {
        name,
        subjectId,
        password,
        assignedClasses: normalizedClasses,
        assignedSections: normalizedSections
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error updating teacher' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.post.deleteMany({ where: { teacherId: id } })
    await prisma.teacher.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error deleting teacher' }, { status: 500 })
  }
}