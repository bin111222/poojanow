'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyPandit(panditId: string) {
  const supabase = createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('pandit_profiles')
    .update({ 
        verification_status: 'verified',
        profile_status: 'published'
    })
    .eq('id', panditId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/pandits')
  return { success: true }
}

export async function rejectPandit(panditId: string) {
  const supabase = createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('pandit_profiles')
    .update({ 
        verification_status: 'rejected',
        profile_status: 'draft'
    })
    .eq('id', panditId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/pandits')
  return { success: true }
}

