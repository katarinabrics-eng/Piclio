import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

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

  const { data: photoGuests } = await supabaseAdmin
    .from('photo_guests')
    .select('photos(id, filename, storage_path, taken_at, uploaded_at)')
    .eq('guest_id', guest.id)

  const photos = (photoGuests ?? [])
    .map(pg => pg.photos as any)
    .filter(Boolean)
    .flat()

  if (photos.length === 0) {
    return NextResponse.json({ guest, event, photos: [] })
  }

  const paths = photos.map((p: any) => p.storage_path)
  const { data: signedUrls } = await supabaseAdmin.storage
    .from('photos')
    .createSignedUrls(paths, 172800) // 48h

  const photosWithUrls = photos.map((p: any, i: number) => ({
    id: p.id,
    url: signedUrls?.[i]?.signedUrl ?? '',
    filename: p.filename,
    taken_at: p.taken_at,
    uploaded_at: p.uploaded_at,
  }))

  return NextResponse.json({ guest, event, photos: photosWithUrls })
}
