import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artworkId, customerEmail, customerName, customerPhone, shippingAddress } = body

    // Get artwork details
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId }
    })

    if (!artwork) {
      return NextResponse.json({ error: 'Obra no encontrada' }, { status: 404 })
    }

    if (!artwork.available) {
      return NextResponse.json({ error: 'Esta obra ya no está disponible' }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: artwork.title,
              description: `${artwork.technique} - ${artwork.dimensions}`,
              images: [artwork.imageUrl],
            },
            unit_amount: Math.round(artwork.price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        artworkId: artwork.id.toString(),
        artworkTitle: artwork.title,
        customerName,
        customerPhone: customerPhone || '',
        shippingAddress: shippingAddress || '',
      },
    })

    // Create order in database
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        customerEmail,
        customerName,
        customerPhone,
        shippingAddress,
        artworkId: artwork.id,
        artworkTitle: artwork.title,
        artworkPrice: artwork.price,
        status: 'pending',
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
