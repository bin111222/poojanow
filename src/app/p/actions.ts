'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function completeBooking(formData: FormData) {
  const supabase = createClient()
  const bookingId = formData.get('bookingId') as string
  
  // 1. Update booking status to completed
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', bookingId)

  if (error) {
    return { error: 'Failed to update booking' }
  }

  // 2. Handle Proof Upload (Mock for MVP)
  // In real app: Upload file to Storage, then insert into booking_proofs
  // Here we just insert a dummy record
  await supabase
    .from('booking_proofs')
    .insert({
        booking_id: bookingId,
        media_type: 'image',
        storage_path: '/proofs/demo-proof.jpg',
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        status: 'uploaded'
    })

  revalidatePath(`/p/booking/${bookingId}`)
  redirect('/p/bookings')
}

