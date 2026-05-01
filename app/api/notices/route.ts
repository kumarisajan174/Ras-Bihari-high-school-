import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        { isPinned: 'desc' },
        { date: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    return NextResponse.json(notices)
  } catch (error) {
    console.error('Error fetching notices:', error)
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const notice = await prisma.notice.create({
      data: {
        title: body.title,
        content: body.content,
        type: body.type,
        date: new Date(body.date),
        isImportant: body.isImportant || false,
        isPinned: body.isPinned || false
      }
    })
    return NextResponse.json(notice)
  } catch (error) {
    console.error('Error creating notice:', error)
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 })
  }
}