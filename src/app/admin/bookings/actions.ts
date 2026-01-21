'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function cancelBookingAdmin(bookingId: string) {
  const supabase = createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/bookings')
  return { success: true }
}

export async function refundBookingAdmin(bookingId: string) {
  const supabase = createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  // In a real app, trigger Stripe/Razorpay refund here
  
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'refunded' })
    .eq('id', bookingId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/bookings')
  return { success: true }
}

