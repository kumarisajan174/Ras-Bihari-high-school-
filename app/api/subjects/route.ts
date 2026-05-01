import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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