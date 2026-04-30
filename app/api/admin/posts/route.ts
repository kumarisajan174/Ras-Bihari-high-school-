import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const sectionId = searchParams.get('sectionId')
    const subjectId = searchParams.get('subjectId')
    const teacherId = searchParams.get('teacherId')

    const where: any = {}
    if (classId) where.classId = classId
    if (sectionId) where.sectionId = sectionId
    if (subjectId) where.subjectId = subjectId
    if (teacherId) where.teacherId = teacherId

    const posts = await prisma.post.findMany({
      where,
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, type, date, teacherId, classId, sectionId, subjectId, isHighlight } = await request.json()
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        date: new Date(date),
        teacherId,
        classId,
        sectionId,
        subjectId,
        isHighlight: isHighlight || false
      }
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const post = await prisma.post.update({
      where: { id },
      data
    })
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
  }
}
