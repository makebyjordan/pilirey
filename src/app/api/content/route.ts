import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    
    const where: { page?: string } = {}
    if (page) where.page = page
    
    const content = await prisma.siteContent.findMany({
      where,
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(content)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const content = await prisma.siteContent.create({
    data: body
  })
  
  return NextResponse.json(content, { status: 201 })
}
