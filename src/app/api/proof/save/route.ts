import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, storagePath, mediaType } = await request.json()

    if (!bookingId || !storagePath || !mediaType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user has permission
    const { data: booking } = await supabase
      .from('bookings')
      .select('pandit_id')
      .eq('id', bookingId)
      .single()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

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

    // Insert proof record
    const { data: proof, error: proofError } = await supabase
      .from('booking_proofs')
      .insert({
        booking_id: bookingId,
        media_type: mediaType,
        storage_path: storagePath,
        uploaded_by: user.id,
        status: 'uploaded'
      })
      .select()
      .single()

    if (proofError) {
      console.error('Proof insert error:', proofError)
      return NextResponse.json({ error: 'Failed to save proof' }, { status: 500 })
    }

    // Update booking proof_status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ proof_status: 'uploaded' })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Booking update error:', updateError)
      // Don't fail the request, proof is saved
    }

    // Auto-generate certificate after first proof upload (Phase 1.5)
    // Check if this is the first proof
    const { data: allProofs } = await supabase
      .from('booking_proofs')
      .select('id')
      .eq('booking_id', bookingId)
      .eq('status', 'uploaded')

    if (allProofs && allProofs.length === 1) {
      // First proof - trigger certificate generation
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/certificate/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId })
        })
      } catch (certError) {
        console.error('Certificate generation error:', certError)
        // Don't fail - certificate can be generated later
      }
    }

    return NextResponse.json({ success: true, proof })
  } catch (error) {
    console.error('Save proof error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

