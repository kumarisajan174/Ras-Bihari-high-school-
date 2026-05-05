import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
    const body = await request.json()
    console.log('=== POST CREATE REQUEST ===')
    console.log('Body:', JSON.stringify(body, null, 2))
    
    const { title, content, contentPages, type, date, teacherId, classId, sectionId, subjectId, isHighlight } = body

    let finalTeacherId = teacherId
    
    if (!finalTeacherId || finalTeacherId.trim() === '') {
      const principal = await prisma.teacher.findFirst({
        where: { name: 'Principal' }
      })
      if (principal) {
        finalTeacherId = principal.id
        console.log('Using Principal teacher:', finalTeacherId)
      }
    }

    const createData: any = {
      title,
      content,
      contentPages: contentPages || null,
      type,
      date: new Date(date),
      classId,
      sectionId,
      subjectId,
      isHighlight: isHighlight || false
    }

    if (finalTeacherId) {
      createData.teacherId = finalTeacherId
    }

    console.log('=== FINAL CREATE DATA ===')
    console.log(JSON.stringify(createData, null, 2))

    const post = await prisma.post.create({
      data: createData
    })
    
    console.log('Post created successfully:', post.id)
    return NextResponse.json(post)
  } catch (error: any) {
    console.error('=== POST CREATE ERROR ===')
    console.error('Error:', error)
    console.error('Error message:', error.message)
    return NextResponse.json({ error: 'Error creating post', details: error.message }, { status: 500 })
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
