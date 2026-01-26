import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

// Verify payment signature (client-side verification)
function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const text = `${orderId}|${paymentId}`
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(text)
    .digest('hex')
  return generatedSignature === signature
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify payment signature
    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, user_id, status')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if payment already processed
    const { data: payment } = await supabase
      .from('payments')
      .select('id, status')
      .eq('booking_id', bookingId)
      .single()

    if (payment && payment.status === 'captured') {
      return NextResponse.json({ 
        verified: true, 
        message: 'Payment already verified',
        bookingStatus: booking.status 
      })
    }

    // Fetch payment details from Razorpay
    try {
      const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id)
      
      if (razorpayPayment.status === 'captured' || razorpayPayment.status === 'authorized') {
        // Update payment record
        const { error: updatePaymentError } = await supabase
          .from('payments')
          .update({
            provider_payment_id: razorpay_payment_id,
            provider_signature: razorpay_signature,
            status: razorpayPayment.status === 'captured' ? 'captured' : 'authorized',
          })
          .eq('booking_id', bookingId)

        if (updatePaymentError) {
          console.error('Payment update error:', updatePaymentError)
        }

        // Update booking status if payment is captured
        if (razorpayPayment.status === 'captured' && booking.status === 'payment_pending') {
          const { error: updateBookingError } = await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId)

          if (updateBookingError) {
            console.error('Booking update error:', updateBookingError)
          }
        }

        return NextResponse.json({ 
          verified: true, 
          paymentStatus: razorpayPayment.status,
          bookingStatus: booking.status 
        })
      } else {
        return NextResponse.json({ 
          verified: false, 
          message: 'Payment not captured',
          paymentStatus: razorpayPayment.status 
        })
      }
    } catch (razorpayError: any) {
      console.error('Razorpay API error:', razorpayError)
      return NextResponse.json(
        { error: 'Failed to verify payment with Razorpay' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

