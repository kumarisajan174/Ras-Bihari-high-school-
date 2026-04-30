import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        subject: true
      },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(teachers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching teachers' }, { status: 500 })
  }
}
