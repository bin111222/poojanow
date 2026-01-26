import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get verified pandits
    const { data: pandits, error } = await supabase
      .from('pandit_profiles')
      .select(`
        id,
        profiles:id (full_name, email)
      `)
      .eq('verification_status', 'verified')
      .eq('profile_status', 'published')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch pandits' }, { status: 500 })
    }

    return NextResponse.json({
      pandits: pandits?.map(p => ({
        id: p.id,
        full_name: p.profiles?.full_name || 'Unknown',
        email: p.profiles?.email || ''
      })) || []
    })
  } catch (error) {
    console.error('Error fetching pandits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

