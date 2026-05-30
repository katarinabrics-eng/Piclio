import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { signPhotosRobust } from '@/lib/supabase/signPhotosRobust'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const { data: guest } = await supabaseAdmin
    .from('guests')
    .select('id, email, name, badge_number, gallery_token, photo_count, event_id')
    .eq('gallery_token', params.token)
    .single()

  if (!guest) {
    return NextResponse.json({ error: 'Galerie nenalezena' }, { status: 404 })
  }

  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, name, date, location, client_name, client_logo_url, brand_color')
    .eq('id', guest.event_id)
    .single()

  if (!event) {
    return NextResponse.json({ error: 'Event nenalezen' }, { status: 404 })
  }

  const { data: photoGuests } = await supabaseAdmin
    .from('photo_guests')
    .select('photo_id')
    .eq('guest_id', guest.id)

  const photoIds = (photoGuests ?? []).map(pg => pg.photo_id)

  const { data: photosData } = photoIds.length > 0
    ? await supabaseAdmin
        .from('photos')
        .select('id, filename, storage_path, original_path, taken_at, uploaded_at')
        .in('id', photoIds)
        .neq('is_deleted', true)
    : { data: [] }

  const photos = photosData ?? []

  console.log('gallery guest_id:', guest.id,
    '| photo_guests rows:', photoGuests?.length ?? 0,
    '| photoIds:', photoIds.length,
    '| photos resolved:', photos.length)

  if (photos.length === 0) {
    return NextResponse.json({ guest, event, photos: [] })
  }

  // Use signPhotosRobust: array-indexed (immune to null item.path), original_path fallback
  const photosWithSignedUrls = await signPhotosRobust(photos, 172800)

  // Log per-photo URL result so we can spot which path fails
  photosWithSignedUrls.forEach((p: any) => {
    console.log('gallery sign:',
      p.filename,
      '| path:', p.storage_path,
      '| url:', p.url ? 'OK' : 'EMPTY')
  })

  const photosWithUrls = photosWithSignedUrls.map((p: any) => ({
    id: p.id,
    url: p.url,
    filename: p.filename,
    taken_at: p.taken_at,
    uploaded_at: p.uploaded_at,
  }))

  console.log('gallery returning:', photosWithUrls.length, 'photos,',
    photosWithUrls.filter(p => !p.url).length, 'with empty URL')

  return NextResponse.json({ guest, event, photos: photosWithUrls })
}
