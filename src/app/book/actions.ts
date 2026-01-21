'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createBooking(formData: FormData) {
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
  
  // Combine date and time into timestamp
  // Note: In a real app, handle timezones carefully. Here assuming local/UTC for simplicity.
  const scheduledAt = `${date}T${time}:00Z`

  // 1. Create Booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      service_id: serviceId,
      scheduled_at: scheduledAt,
      status: 'payment_pending', // In real app, created -> payment_pending
      notes: notes,
      total_amount: parseInt(price),
      currency: 'INR'
    })
    .select()
    .single()

  if (bookingError) {
    console.error('Booking Error:', bookingError)
    return { error: 'Failed to create booking. Please try again.' }
  }

  // 2. Mock Payment (Skip Razorpay for now, just mark confirmed)
  // In real implementation, we would create a Razorpay order here and return the order ID.
  // Then the client would open the checkout.
  
  // For V1 Demo: Auto-confirm
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', booking.id)

  if (updateError) {
     return { error: 'Payment failed' }
  }

  revalidatePath('/u/bookings')
  redirect(`/u/booking/${booking.id}?success=true`)
}

