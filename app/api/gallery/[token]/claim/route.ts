import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { photoId } = await req.json()
  if (!photoId) return NextResponse.json({ error: 'photoId required' }, { status: 400 })

  const { data: guest } = await supabaseAdmin
    .from('guests')
    .select('id, event_id, photo_count')
    .eq('gallery_token', params.token)
    .single()

  if (!guest) return NextResponse.json({ error: 'Galerie nenalezena' }, { status: 404 })

  const { data: photo } = await supabaseAdmin
    .from('photos')
    .select('id')
    .eq('id', photoId)
    .eq('event_id', guest.event_id)
    .single()

  if (!photo) return NextResponse.json({ error: 'Fotka nenalezena' }, { status: 404 })

  const { error } = await supabaseAdmin
    .from('photo_guests')
    .insert({ photo_id: photoId, guest_id: guest.id, assigned_by: 'manual' })

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Nastav status = 'matched' aby fotka zmizela z unmatched listu
  if (!error) {
    await supabaseAdmin
      .from('photos')
      .update({ status: 'matched' })
      .eq('id', photoId)

    await supabaseAdmin
      .from('guests')
      .update({ photo_count: guest.photo_count + 1 })
      .eq('id', guest.id)
  } else {
    // duplicate insert (23505) — photo_count neměnit, status už je matched
  }

  return NextResponse.json({ ok: true })
}
