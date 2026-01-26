import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Verify Razorpay webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const generatedSignature = hmac.digest('hex')
  return generatedSignature === signature
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
    
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature') || ''

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    const supabase = createClient()

    // Handle payment events
    if (event.event === 'payment.captured' || event.event === 'payment.authorized') {
      const payment = event.payload.payment.entity
      
      // Find payment record by provider_order_id (Razorpay order ID)
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .select('id, booking_id, status')
        .eq('provider_order_id', payment.order_id)
        .single()

      if (paymentError || !paymentRecord) {
        console.error('Payment record not found:', paymentError)
        return NextResponse.json(
          { error: 'Payment record not found' },
          { status: 404 }
        )
      }

      // Update payment record
      const { error: updatePaymentError } = await supabase
        .from('payments')
        .update({
          provider_payment_id: payment.id,
          provider_signature: signature,
          status: payment.status === 'captured' ? 'captured' : 'authorized',
        })
        .eq('id', paymentRecord.id)

      if (updatePaymentError) {
        console.error('Payment update error:', updatePaymentError)
        return NextResponse.json(
          { error: 'Failed to update payment' },
          { status: 500 }
        )
      }

      // If payment is captured, update booking status to confirmed
      if (payment.status === 'captured') {
        const { error: updateBookingError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', paymentRecord.booking_id)
          .eq('status', 'payment_pending')

        if (updateBookingError) {
          console.error('Booking update error:', updateBookingError)
          // Don't fail the webhook - payment is already recorded
        }

        // Create payout ledger entry (Phase 3.3)
        const { data: booking } = await supabase
          .from('bookings')
          .select('total_amount, temple_id, pandit_id')
          .eq('id', paymentRecord.booking_id)
          .single()

        if (booking) {
          // Calculate splits (simplified - adjust based on your business logic)
          const platformCommissionPercent = 15 // Default 15%
          const platformFee = Math.round(booking.total_amount * platformCommissionPercent / 100)
          const remaining = booking.total_amount - platformFee
          
          // Split remaining between temple and pandit (50-50 for now, adjust as needed)
          const templeShare = Math.round(remaining / 2)
          const panditShare = remaining - templeShare

          await supabase
            .from('payout_ledger')
            .insert({
              booking_id: paymentRecord.booking_id,
              total_amount_inr: booking.total_amount,
              temple_share_inr: templeShare,
              pandit_share_inr: panditShare,
              platform_fee_inr: platformFee,
              status: 'pending',
            })
        }
      }
    }

    // Handle payment failure
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity
      
      const { data: paymentRecord } = await supabase
        .from('payments')
        .select('id, booking_id')
        .eq('provider_order_id', payment.order_id)
        .single()

      if (paymentRecord) {
        // Update payment status
        await supabase
          .from('payments')
          .update({
            provider_payment_id: payment.id,
            status: 'failed',
          })
          .eq('id', paymentRecord.id)

        // Optionally update booking status or keep as payment_pending
        // For now, we'll keep it as payment_pending so user can retry
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Also handle GET for webhook verification (if Razorpay requires it)
export async function GET() {
  return NextResponse.json({ message: 'Razorpay webhook endpoint' })
}

