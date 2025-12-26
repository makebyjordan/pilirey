import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = await prisma.socialPost.findMany({
      orderBy: { publishedAt: 'desc' }
    })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const post = await prisma.socialPost.create({
    data: body
  })
  
  return NextResponse.json(post, { status: 201 })
}
