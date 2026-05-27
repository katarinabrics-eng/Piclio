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
    .select('photos(id, filename, storage_path, original_path, taken_at, uploaded_at)')
    .eq('guest_id', guest.id)

  const photos = (photoGuests ?? [])
    .flatMap(pg => {
      const p = pg.photos as any
      if (!p) return []
      return Array.isArray(p) ? p : [p]
    })

  console.log('gallery guest_id:', guest.id, 'photo_guests rows:', photoGuests?.length ?? 0, 'photos:', photos.length)

  if (photos.length === 0) {
    return NextResponse.json({ guest, event, photos: [] })
  }

  // Use signPhotosRobust: array-indexed (immune to null item.path), original_path fallback
  const photosWithSignedUrls = await signPhotosRobust(photos, 172800)

  const photosWithUrls = photosWithSignedUrls.map((p: any) => ({
    id: p.id,
    url: p.url,
    filename: p.filename,
    taken_at: p.taken_at,
    uploaded_at: p.uploaded_at,
  }))

  return NextResponse.json({ guest, event, photos: photosWithUrls })
}
