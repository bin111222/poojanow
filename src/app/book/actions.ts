'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createBooking(prevState: any, formData: FormData) {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?error=Please login to book a service')
  }

  const serviceId = formData.get('serviceId') as string
  const date = formData.get('date') as string // YYYY-MM-DD
  const time = formData.get('time') as string // HH:mm
  const notes = formData.get('notes') as string
  const price = formData.get('price') as string
  const durationMinutes = formData.get('durationMinutes') as string
  
  // Combine date and time into timestamp
  // Note: In a real app, handle timezones carefully. Here assuming local/UTC for simplicity.
  const scheduledStart = `${date}T${time}:00Z`
  
  // Calculate scheduled_end based on duration
  const duration = durationMinutes ? parseInt(durationMinutes) : 45 // Default 45 minutes
  const scheduledStartDate = new Date(scheduledStart)
  const scheduledEndDate = new Date(scheduledStartDate.getTime() + duration * 60 * 1000)
  const scheduledEnd = scheduledEndDate.toISOString()
  
  // Calculate SLA deadline (2 hours after scheduled_end by default)
  const slaHours = 2
  const slaDeadline = new Date(scheduledEndDate.getTime() + slaHours * 60 * 60 * 1000).toISOString()

  // Verify service is the active single pooja (Phase 1 requirement)
  const { data: service } = await supabase
    .from('services')
    .select('id, is_active_single_pooja, status')
    .eq('id', serviceId)
    .single()
  
  if (!service || !service.is_active_single_pooja || service.status !== 'published') {
    return { error: 'This service is not available for booking at this time.' }
  }

  // 1. Create Booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      service_id: serviceId,
      scheduled_at: scheduledStart, // Keep for backward compatibility
      scheduled_start: scheduledStart,
      scheduled_end: scheduledEnd,
      duration_minutes: duration,
      status: 'payment_pending', // In real app, created -> payment_pending
      notes: notes,
      total_amount: parseInt(price),
      currency: 'INR',
      proof_sla_hours: slaHours,
      proof_sla_deadline: slaDeadline
    })
    .select()
    .single()

  if (bookingError) {
    console.error('Booking Error:', bookingError)
    return { error: 'Failed to create booking. Please try again.' }
  }

  // 2. Return booking ID for payment processing
  // Payment will be handled via Razorpay checkout on the client side
  // Webhook will update booking status to 'confirmed' after payment verification
  
  revalidatePath('/u/bookings')
  return { success: true, bookingId: booking.id }
}
