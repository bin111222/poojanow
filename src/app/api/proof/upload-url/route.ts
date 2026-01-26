import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, fileName, fileType } = await request.json()

    if (!bookingId || !fileName || !fileType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user has permission (pandit assigned to booking or admin)
    const { data: booking } = await supabase
      .from('bookings')
      .select('pandit_id, temple_id')
      .eq('id', bookingId)
      .single()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if user is the assigned pandit or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isPandit = booking.pandit_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isPandit && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Generate unique file path
    const fileExt = fileName.split('.').pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const path = `${bookingId}/${timestamp}-${randomStr}.${fileExt}`

    // Get signed upload URL (valid for 1 hour)
    const { data, error } = await supabase
      .storage
      .from('pooja-proofs')
      .createSignedUploadUrl(path, {
        upsert: false
      })

    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 })
    }

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      path: `pooja-proofs/${path}`
    })
  } catch (error) {
    console.error('Upload URL error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

