import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  
  const content = await prisma.siteContent.update({
    where: { id: parseInt(id) },
    data: body
  })
  
  return NextResponse.json(content)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.siteContent.delete({
    where: { id: parseInt(id) }
  })
  
  return NextResponse.json({ success: true })
}
