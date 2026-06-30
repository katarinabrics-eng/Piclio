import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { eventSlug: string } }
) {
  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Neplatný e-mail' }, { status: 400 })
  }

  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id')
    .eq('slug', params.eventSlug)
    .single()

  if (!event) return NextResponse.json({ error: 'Event nenalezen' }, { status: 404 })

  const normalizedEmail = email.toLowerCase().trim()

  const { data: existing } = await supabaseAdmin
    .from('guests')
    .select('gallery_token')
    .eq('event_id', event.id)
    .eq('email', normalizedEmail)
    .single()

  if (existing) return NextResponse.json({ galleryToken: existing.gallery_token })

  const { data: newGuest, error } = await supabaseAdmin
    .from('guests')
    .insert({
      event_id: event.id,
      email: normalizedEmail,
      gdpr_consent: true,
      registered_at: new Date().toISOString(),
    })
    .select('gallery_token')
    .single()

  if (error || !newGuest) {
    return NextResponse.json({ error: 'Nepodařilo se vytvořit účet' }, { status: 500 })
  }

  return NextResponse.json({ galleryToken: newGuest.gallery_token })
}
