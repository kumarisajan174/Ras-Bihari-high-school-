import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
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
    const { name, subject, password, classNames, sectionNames } = await request.json()
    
    const teacher = await prisma.teacher.create({
      data: {
        name,
        subject,
        password,
        assignedClasses: classNames || [],
        assignedSections: sectionNames || []
      }
    })

    return NextResponse.json(teacher)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating teacher' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, subject, password, classNames, sectionNames } = await request.json()
    
    await prisma.teacher.update({
      where: { id },
      data: {
        name,
        subject,
        password,
        assignedClasses: classNames || [],
        assignedSections: sectionNames || []
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