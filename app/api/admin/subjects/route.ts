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
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching subjects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    await prisma.subject.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting subject' }, { status: 500 })
  }
}
