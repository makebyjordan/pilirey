import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const group = searchParams.get('group')
  
  const where: { group?: string } = {}
  if (group) where.group = group
  
  const settings = await prisma.siteSettings.findMany({
    where,
    orderBy: { key: 'asc' }
  })
  
  return NextResponse.json(settings)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const setting = await prisma.siteSettings.upsert({
    where: { key: body.key },
    update: { value: body.value },
    create: body
  })
  
  return NextResponse.json(setting)
}
