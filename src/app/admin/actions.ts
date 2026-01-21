'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTemple(formData: FormData) {
  const supabase = createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const deity = formData.get('deity') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string || 'draft'

  const { error } = await supabase.from('temples').insert({
    name,
    slug,
    city,
    state,
    deity,
    description,
    status,
    created_by: user.id
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/temples')
  return { success: true }
}

export async function updateTempleStatus(templeId: string, status: string) {
  const supabase = createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('temples')
    .update({ status })
    .eq('id', templeId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/temples')
  return { success: true }
}

