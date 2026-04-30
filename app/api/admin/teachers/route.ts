import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
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

export async function POST(request: Request) {
  try {
    const { name, subjectId, password, classIds, sectionIds } = await request.json()
    
    const teacher = await prisma.teacher.create({
      data: {
        name,
        subjectId,
        password
      }
    })

    if (classIds && sectionIds) {
      for (const classId of classIds) {
        for (const sectionId of sectionIds) {
          await prisma.teacherAssignment.create({
            data: {
              teacherId: teacher.id,
              classId,
              sectionId
            }
          })
        }
      }
    }

    return NextResponse.json(teacher)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating teacher' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, subjectId, password, classIds, sectionIds } = await request.json()
    
    await prisma.teacher.update({
      where: { id },
      data: {
        name,
        subjectId,
        password
      }
    })

    await prisma.teacherAssignment.deleteMany({ where: { teacherId: id } })

    if (classIds && sectionIds) {
      for (const classId of classIds) {
        for (const sectionId of sectionIds) {
          await prisma.teacherAssignment.create({
            data: {
              teacherId: id,
              classId,
              sectionId
            }
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error updating teacher' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.teacherAssignment.deleteMany({ where: { teacherId: id } })
    await prisma.post.deleteMany({ where: { teacherId: id } })
    await prisma.teacher.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error deleting teacher' }, { status: 500 })
  }
}
