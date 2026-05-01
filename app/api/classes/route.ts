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