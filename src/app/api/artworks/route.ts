import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  
  const where: any = {}
  if (category) where.category = category
  if (featured === 'true') where.featured = true
  
  const artworks = await prisma.artwork.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(artworks)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const artwork = await prisma.artwork.create({
    data: body
  })
  
  return NextResponse.json(artwork, { status: 201 })
}
