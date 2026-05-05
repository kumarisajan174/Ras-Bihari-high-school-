import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'

// Helper function to check admin authentication
function checkAdminAuth() {
  const token = cookies().get("admin_token");
  if (!token) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  // GET requests can be public for now
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
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('=== POST CREATE REQUEST ===')
    console.log('Body:', body)
    
    const { title, content, contentPages, type, date, teacherId, classId, sectionId, subjectId, isHighlight } = body

    // Validate all required fields
    console.log('Validating fields...')
    console.log('teacherId:', teacherId)
    console.log('classId:', classId)
    console.log('sectionId:', sectionId)
    console.log('subjectId:', subjectId)
    
    // Check if relations exist
    const [classExists, sectionExists, subjectExists] = await Promise.all([
      prisma.class.findUnique({ where: { id: classId } }),
      prisma.section.findUnique({ where: { id: sectionId } }),
      prisma.subject.findUnique({ where: { id: subjectId } })
    ])
    
    console.log('Class exists:', !!classExists)
    console.log('Section exists:', !!sectionExists)
    console.log('Subject exists:', !!subjectExists)

    const post = await prisma.post.create({
      data: {
        title,
        content,
        contentPages: contentPages || null,
        type,
        date: new Date(date),
        teacherId: teacherId || null,
        classId,
        sectionId,
        subjectId,
        isHighlight: isHighlight || false
      }
    })
    
    console.log('Post created successfully:', post.id)
    return NextResponse.json(post)
  } catch (error: any) {
    console.error('=== POST CREATE ERROR ===')
    console.error('Error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ error: 'Error creating post', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
  }
}
