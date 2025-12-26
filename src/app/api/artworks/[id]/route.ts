import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const artwork = await prisma.artwork.findUnique({
    where: { id: parseInt(id) }
  })
  
  if (!artwork) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json(artwork)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  
  const artwork = await prisma.artwork.update({
    where: { id: parseInt(id) },
    data: body
  })
  
  return NextResponse.json(artwork)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.artwork.delete({
    where: { id: parseInt(id) }
  })
  
  return NextResponse.json({ success: true })
}
