import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, amount } = await request.json()

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'Missing bookingId or amount' }, { status: 400 })
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, user_id, status, total_amount')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.status !== 'payment_pending') {
      return NextResponse.json({ error: 'Booking is not in payment pending state' }, { status: 400 })
    }

    if (booking.total_amount !== amount) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
    }

    // Create Razorpay order
    const orderOptions = {
      amount: amount * 100, // Razorpay expects amount in paise (smallest currency unit)
      currency: 'INR',
      receipt: `booking_${bookingId.substring(0, 8)}`,
      notes: {
        booking_id: bookingId,
        user_id: user.id,
      },
    }

    const razorpayOrder = await razorpay.orders.create(orderOptions)

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        provider: 'razorpay',
        provider_order_id: razorpayOrder.id,
        amount_inr: amount,
        status: 'created',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment record creation error:', paymentError)
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 })
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      paymentId: payment.id,
    })
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}

