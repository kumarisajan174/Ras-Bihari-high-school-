import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const notice = await prisma.notice.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        type: body.type,
        date: new Date(body.date),
        isImportant: body.isImportant,
        isPinned: body.isPinned
      }
    })
    return NextResponse.json(notice)
  } catch (error) {
    console.error('Error updating notice:', error)
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.notice.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Notice deleted successfully' })
  } catch (error) {
    console.error('Error deleting notice:', error)
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 })
  }
}
