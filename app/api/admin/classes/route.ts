import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(classes)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching classes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const cls = await prisma.class.create({
      data: { name }
    })
    return NextResponse.json(cls)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating class' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.class.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting class' }, { status: 500 })
  }
}