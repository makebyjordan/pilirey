import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json([])
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, estimatedDays, trackingNumber, notes, status } = body

    const order = await prisma.order.update({
      where: { id },
      data: {
        estimatedDays,
        trackingNumber,
        notes,
        status,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Error al actualizar pedido' }, { status: 500 })
  }
}
