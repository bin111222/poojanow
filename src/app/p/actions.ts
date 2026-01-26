'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function completeBooking(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const bookingId = formData.get('bookingId') as string
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Verify booking exists and user is assigned pandit
  const { data: booking } = await supabase
    .from('bookings')
    .select('pandit_id, status, scheduled_start, scheduled_end')
    .eq('id', bookingId)
    .single()

  if (!booking) {
    throw new Error('Booking not found')
  }

  if (booking.pandit_id !== user.id) {
    throw new Error('Unauthorized: You are not assigned to this booking')
  }

  // 2. CRITICAL: Enforce minimum 1 proof before completion (Phase 1.3)
  const { data: proofs, error: proofError } = await supabase
    .from('booking_proofs')
    .select('id')
    .eq('booking_id', bookingId)
    .eq('status', 'uploaded')

  if (proofError) {
    throw new Error('Failed to check proofs')
  }

  if (!proofs || proofs.length < 1) {
    throw new Error('Cannot complete booking: At least 1 proof photo is required. Please upload proof first.')
  }

  // 3. Verify we're within scheduled time window (or allow admin override)
  const now = new Date()
  const scheduledEnd = booking.scheduled_end ? new Date(booking.scheduled_end) : null
  
  // Allow completion if within window or up to 2 hours after (grace period)
  const gracePeriodEnd = scheduledEnd ? new Date(scheduledEnd.getTime() + 2 * 60 * 60 * 1000) : null
  
  if (scheduledEnd && gracePeriodEnd && now > gracePeriodEnd) {
    // Check if user is admin (for override)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      throw new Error('Cannot complete booking: Scheduled time window has passed. Please contact admin for override.')
    }
  }

  // 4. Update booking status to completed
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ 
      status: 'completed',
      proof_status: 'approved' // Auto-approve if pandit completes
    })
    .eq('id', bookingId)

  if (updateError) {
    throw new Error('Failed to update booking')
  }

  // 5. Auto-approve all uploaded proofs for this booking
  await supabase
    .from('booking_proofs')
    .update({ 
      status: 'approved',
      approved_by: user.id
    })
    .eq('booking_id', bookingId)
    .eq('status', 'uploaded')

  revalidatePath(`/p/booking/${bookingId}`)
  redirect('/p/bookings')
}
