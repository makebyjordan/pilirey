import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Update order status
      await prisma.order.update({
        where: { stripeSessionId: session.id },
        data: {
          status: 'paid',
          stripePaymentId: session.payment_intent as string,
        },
      })

      // Mark artwork as sold (not available)
      const artworkId = parseInt(session.metadata?.artworkId || '0')
      if (artworkId) {
        await prisma.artwork.update({
          where: { id: artworkId },
          data: { available: false },
        })
      }

      console.log(`✅ Order ${session.id} completed successfully`)
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session

      await prisma.order.update({
        where: { stripeSessionId: session.id },
        data: { status: 'expired' },
      })

      console.log(`⏰ Order ${session.id} expired`)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`❌ Payment failed: ${paymentIntent.id}`)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
