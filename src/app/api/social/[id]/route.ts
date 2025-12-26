import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  
  const post = await prisma.socialPost.update({
    where: { id: parseInt(id) },
    data: body
  })
  
  return NextResponse.json(post)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.socialPost.delete({
    where: { id: parseInt(id) }
  })
  
  return NextResponse.json({ success: true })
}
