import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const message = await prisma.contactMessage.create({
    data: {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message
    }
  })
  
  return NextResponse.json(message, { status: 201 })
}
