import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

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
    .select('photos(id, filename, storage_path, taken_at, uploaded_at)')
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

  const paths = photos.map((p: any) => p.storage_path)

  // Batch signed URLs with individual fallback for any that fail
  const signedUrlMap: Record<string, string> = {}
  try {
    const { data, error: urlError } = await supabaseAdmin.storage
      .from('photos').createSignedUrls(paths, 172800)
    if (urlError) console.error('gallery createSignedUrls error:', urlError.message)
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) signedUrlMap[item.path] = item.signedUrl
    }
  } catch (e) {
    console.error('gallery createSignedUrls threw:', e)
  }
  // Fallback: individual call for any path that got no URL
  await Promise.all(paths.map(async path => {
    if (signedUrlMap[path]) return
    try {
      const { data } = await supabaseAdmin.storage.from('photos').createSignedUrl(path, 172800)
      if (data?.signedUrl) signedUrlMap[path] = data.signedUrl
      else console.warn('gallery: no signedUrl for path:', path)
    } catch (e) { console.error('gallery: createSignedUrl failed for', path, e) }
  }))

  const photosWithUrls = photos.map((p: any) => ({
    id: p.id,
    url: signedUrlMap[p.storage_path] ?? '',
    filename: p.filename,
    taken_at: p.taken_at,
    uploaded_at: p.uploaded_at,
  }))

  return NextResponse.json({ guest, event, photos: photosWithUrls })
}
