import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * SLA Breach Checker
 * 
 * This endpoint checks for bookings that have breached their proof SLA deadline.
 * It should be called periodically (e.g., every hour) via a cron job.
 * 
 * Logic:
 * 1. Find bookings where proof_sla_deadline has passed
 * 2. Check if they have no proof or insufficient proof
 * 3. Mark as is_sla_breached = true
 * 4. Create ops_issues records
 * 5. Set sla_breached_at timestamp
 */
export async function POST(request: Request) {
  try {
    // Optional: Add authentication/authorization check
    // For cron jobs, you can use a secret token in headers
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || ''

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const now = new Date().toISOString()

    // Find bookings where:
    // 1. proof_sla_deadline has passed
    // 2. is_sla_breached is false (not already marked)
    // 3. status is confirmed, in_progress, or completed (but without proof)
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        proof_sla_deadline,
        scheduled_end,
        status,
        booking_proofs (id, status)
      `)
      .lt('proof_sla_deadline', now) // Deadline has passed
      .eq('is_sla_breached', false) // Not already marked
      .in('status', ['confirmed', 'in_progress', 'completed'])

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({
        success: true,
        breachesFound: 0,
        breachesProcessed: 0,
        message: 'No SLA breaches found'
      })
    }

    let breachesProcessed = 0
    const errors: string[] = []

    // Process each booking
    for (const booking of bookings) {
      // Count approved/uploaded proofs
      const proofs = booking.booking_proofs || []
      const proofCount = proofs.filter(
        (p: any) => p.status === 'uploaded' || p.status === 'approved'
      ).length

      // Only mark as breached if no proof or insufficient proof
      if (proofCount < 1) {
        try {
          // Check if ops_issue already exists for this booking
          const { data: existingIssue } = await supabase
            .from('ops_issues')
            .select('id')
            .eq('booking_id', booking.id)
            .eq('issue_type', 'sla_breach')
            .eq('status', 'open')
            .single()

          // Mark booking as SLA breached
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              is_sla_breached: true,
              sla_breached_at: now,
            })
            .eq('id', booking.id)

          if (updateError) {
            console.error(`Failed to update booking ${booking.id}:`, updateError)
            errors.push(`Booking ${booking.id}: ${updateError.message}`)
            continue
          }

          // Create ops_issue if it doesn't exist
          if (!existingIssue) {
            const deadline = booking.proof_sla_deadline
              ? new Date(booking.proof_sla_deadline)
              : null
            const scheduledEnd = booking.scheduled_end
              ? new Date(booking.scheduled_end)
              : null

            const hoursPastDeadline = deadline
              ? Math.round((new Date().getTime() - deadline.getTime()) / (1000 * 60 * 60))
              : 0

            // Determine severity based on how long past deadline
            let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
            if (hoursPastDeadline > 24) {
              severity = 'critical'
            } else if (hoursPastDeadline > 12) {
              severity = 'high'
            } else if (hoursPastDeadline > 6) {
              severity = 'medium'
            } else {
              severity = 'low'
            }

            const description = `Proof SLA breached. Deadline was ${deadline?.toLocaleString()}. ${
              scheduledEnd
                ? `Pooja was scheduled to end at ${scheduledEnd.toLocaleString()}.`
                : ''
            } No proof uploaded yet.`

            const { error: issueError } = await supabase
              .from('ops_issues')
              .insert({
                booking_id: booking.id,
                issue_type: 'sla_breach',
                severity: severity,
                status: 'open',
                description: description,
              })

            if (issueError) {
              console.error(`Failed to create ops_issue for booking ${booking.id}:`, issueError)
              errors.push(`Booking ${booking.id}: Failed to create ops_issue`)
            } else {
              breachesProcessed++
            }
          } else {
            // Issue already exists, just count it
            breachesProcessed++
          }
        } catch (error: any) {
          console.error(`Error processing booking ${booking.id}:`, error)
          errors.push(`Booking ${booking.id}: ${error.message}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      breachesFound: bookings.length,
      breachesProcessed: breachesProcessed,
      errors: errors.length > 0 ? errors : undefined,
      message: `Processed ${breachesProcessed} SLA breach${breachesProcessed !== 1 ? 'es' : ''}`
    })
  } catch (error: any) {
    console.error('SLA breach check error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for manual testing
export async function GET() {
  return NextResponse.json({
    message: 'SLA Breach Checker API',
    usage: 'POST to this endpoint to check for SLA breaches',
    note: 'Set CRON_SECRET in environment variables for authentication'
  })
}

