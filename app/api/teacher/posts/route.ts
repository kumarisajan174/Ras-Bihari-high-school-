import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId')

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 })
    }

    const posts = await prisma.post.findMany({
      where: { teacherId },
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

export async function DELETE(request: Request) {
  try {
    const { id, teacherId } = await request.json()

    const post = await prisma.post.findUnique({ where: { id } })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.teacherId !== teacherId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
  }
}