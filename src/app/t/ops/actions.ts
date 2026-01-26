'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignPandit(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const bookingId = formData.get('bookingId') as string
  const panditId = formData.get('panditId') as string

  if (!bookingId || !panditId) {
    throw new Error('Missing required fields')
  }

  // Verify user is admin or temple admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    // TODO: Check temple admin permissions
    throw new Error('Unauthorized')
  }

  // Update booking with pandit assignment
  const { error } = await supabase
    .from('bookings')
    .update({ pandit_id: panditId })
    .eq('id', bookingId)

  if (error) {
    throw new Error('Failed to assign pandit')
  }

  revalidatePath('/t/ops')
}

export async function completeBookingTemple(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const bookingId = formData.get('bookingId') as string

  // Verify user is admin or temple admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // Verify proof exists
  const { data: proofs } = await supabase
    .from('booking_proofs')
    .select('id')
    .eq('booking_id', bookingId)
    .eq('status', 'uploaded')

  if (!proofs || proofs.length < 1) {
    throw new Error('Cannot complete: Proof required')
  }

  // Update booking status
  const { error } = await supabase
    .from('bookings')
    .update({ 
      status: 'completed',
      proof_status: 'approved'
    })
    .eq('id', bookingId)

  if (error) {
    throw new Error('Failed to complete booking')
  }

  // Auto-approve proofs
  await supabase
    .from('booking_proofs')
    .update({ 
      status: 'approved',
      approved_by: user.id
    })
    .eq('booking_id', bookingId)
    .eq('status', 'uploaded')

  revalidatePath('/t/ops')
}

