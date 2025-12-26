import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()
  
  const user = await prisma.adminUser.findUnique({
    where: { username }
  })
  
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }
  
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  return NextResponse.json({ token, user: { id: user.id, username: user.username } })
}
