import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')
    const classId = searchParams.get('classId')
    const sectionId = searchParams.get('sectionId')
    const subjectId = searchParams.get('subjectId')
    const date = searchParams.get('date')
    const isHighlight = searchParams.get('isHighlight')

    const where: any = {}
    if (teacherId) where.teacherId = teacherId
    if (classId) where.classId = classId
    if (sectionId) where.sectionId = sectionId
    if (subjectId) where.subjectId = subjectId
    if (isHighlight !== null) where.isHighlight = isHighlight === 'true'
    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setDate(endOfDay.getDate() + 1)
      where.date = {
        gte: startOfDay,
        lt: endOfDay
      }
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        teacher: true,
        subject: true,
        class: true,
        section: true
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}