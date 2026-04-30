import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(sections)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching sections' }, { status: 500 })
  }
}
