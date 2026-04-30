import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching subjects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const subject = await prisma.subject.create({
      data: { name }
    })
    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating subject' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.subject.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting subject' }, { status: 500 })
  }
}
