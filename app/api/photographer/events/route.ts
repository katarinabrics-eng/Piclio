import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

function isAuthorized(req: NextRequest) {
  return req.cookies.get('photographer_token')?.value === process.env.PHOTOGRAPHER_TOKEN
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, name, slug, date, location, status, max_guests, client_name')
    .order('date', { ascending: false })

  if (!events) return NextResponse.json({ events: [] })

  const eventsWithStats = await Promise.all(events.map(async (event) => {
    const [
      { count: guestCount },
      { count: photoCount },
      { count: unmatchedCount },
      { count: deliveredCount },
    ] = await Promise.all([
      supabaseAdmin.from('guests').select('*', { count: 'exact', head: true }).eq('event_id', event.id),
      supabaseAdmin.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', event.id),
      supabaseAdmin.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', event.id).eq('status', 'unmatched'),
      supabaseAdmin.from('guests').select('*', { count: 'exact', head: true }).eq('event_id', event.id).not('email_sent_at', 'is', null),
    ])
    return { ...event, guestCount: guestCount ?? 0, photoCount: photoCount ?? 0, unmatchedCount: unmatchedCount ?? 0, deliveredCount: deliveredCount ?? 0 }
  }))

  return NextResponse.json({ events: eventsWithStats })
}
