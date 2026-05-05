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

export async function POST(request: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name } = await request.json()
    const section = await prisma.section.create({
      data: { name }
    })
    return NextResponse.json(section)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating section' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    await prisma.section.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting section' }, { status: 500 })
  }
}
