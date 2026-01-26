'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Verify admin helper
async function verifyAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', user: null }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Unauthorized', user: null }
  
  return { user, error: null }
}

// Update Service
export async function updateService(prevState: any, formData: FormData) {
  const { user, error } = await verifyAdmin()
  if (error || !user) return { error: 'Unauthorized', success: false }

  const serviceId = formData.get('serviceId') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const service_type = formData.get('service_type') as string
  const base_price_inr = parseInt(formData.get('base_price_inr') as string)
  const duration_minutes = formData.get('duration_minutes') ? parseInt(formData.get('duration_minutes') as string) : null
  const status = formData.get('status') as string
  const pooja_explanation = formData.get('pooja_explanation') as string
  const is_active_single_pooja = formData.get('is_active_single_pooja') === 'on'
  const event_category = formData.get('event_category') === 'on' ? 'event_based' : 'regular'

  const supabase = createClient()

  const updateData: any = {
    title,
    description: description || null,
    service_type,
    base_price_inr,
    duration_minutes,
    status,
    pooja_explanation: pooja_explanation || null,
    is_active_single_pooja,
    event_category
  }

  const { error: updateError } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', serviceId)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin/data')
  revalidatePath('/poojas')
  revalidatePath('/pandits')
  return { success: true }
}

// Update Pandit
export async function updatePandit(prevState: any, formData: FormData) {
  const { user, error } = await verifyAdmin()
  if (error || !user) return { error: 'Unauthorized', success: false }

  const panditId = formData.get('panditId') as string
  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const phone = formData.get('phone') as string
  const bio = formData.get('bio') as string
  const years_of_experience = formData.get('years_of_experience') ? parseInt(formData.get('years_of_experience') as string) : null
  const rating = formData.get('rating') ? parseFloat(formData.get('rating') as string) : null
  const total_bookings = formData.get('total_bookings') ? parseInt(formData.get('total_bookings') as string) : null
  const verification_status = formData.get('verification_status') as string
  const profile_status = formData.get('profile_status') as string
  const specialties = formData.get('specialties') as string

  const supabase = createClient()

  // Update profile
  if (full_name || email) {
    const profileUpdate: any = {}
    if (full_name) profileUpdate.full_name = full_name
    if (email) profileUpdate.email = email

    await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', panditId)
  }

  // Update pandit profile
  const panditUpdate: any = {
    city: city || null,
    state: state || null,
    phone: phone || null,
    bio: bio || null,
    years_of_experience,
    rating,
    total_bookings,
    verification_status,
    profile_status
  }

  if (specialties) {
    panditUpdate.specialties = specialties.split(',').map(s => s.trim()).filter(Boolean)
  }

  const { error: updateError } = await supabase
    .from('pandit_profiles')
    .update(panditUpdate)
    .eq('id', panditId)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin/data')
  revalidatePath('/admin/pandits')
  revalidatePath('/pandits')
  return { success: true }
}

// Update Temple
export async function updateTemple(prevState: any, formData: FormData) {
  const { user, error } = await verifyAdmin()
  if (error || !user) return { error: 'Unauthorized', success: false }

  const templeId = formData.get('templeId') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const deity = formData.get('deity') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const status = formData.get('status') as string
  const phone = formData.get('phone') as string

  const supabase = createClient()

  const updateData: any = {
    name,
    slug,
    city: city || null,
    state: state || null,
    deity: deity || null,
    description: description || null,
    address: address || null,
    status,
    phone: phone || null
  }

  const { error: updateError } = await supabase
    .from('temples')
    .update(updateData)
    .eq('id', templeId)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin/data')
  revalidatePath('/admin/temples')
  revalidatePath('/temples')
  return { success: true }
}

// Delete Service
export async function deleteService(serviceId: string) {
  const { user, error } = await verifyAdmin()
  if (error || !user) return { error: 'Unauthorized' }

  const supabase = createClient()

  const { error: deleteError } = await supabase
    .from('services')
    .delete()
    .eq('id', serviceId)

  if (deleteError) {
    return { error: deleteError.message }
  }

  revalidatePath('/admin/data')
  return { success: true }
}

// Toggle Service Status
export async function toggleServiceStatus(serviceId: string, currentStatus: string) {
  const { user, error } = await verifyAdmin()
  if (error || !user) return { error: 'Unauthorized' }

  const supabase = createClient()
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'

  const { error: updateError } = await supabase
    .from('services')
    .update({ status: newStatus })
    .eq('id', serviceId)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/admin/data')
  return { success: true, status: newStatus }
}

